package com.sivumi.offline

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import com.google.ai.edge.litertlm.Backend
import com.google.ai.edge.litertlm.Contents
import com.google.ai.edge.litertlm.ConversationConfig
import com.google.ai.edge.litertlm.Engine
import com.google.ai.edge.litertlm.EngineConfig
import com.google.ai.edge.litertlm.LogSeverity
import com.google.ai.edge.litertlm.SamplerConfig
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream

class GemmaBridge(
    private val context: Context,
    private val webView: WebView,
) {
    companion object {
        private const val MODEL_ASSET = "models/gemma3-270m-it-q8.litertlm"
        private const val MODEL_NAME = "Gemma 3 270M IT"
        private const val MIN_REAL_MODEL_BYTES = 250_000_000L
    }

    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.Default)
    private val lock = Any()

    @Volatile
    private var engine: Engine? = null

    @Volatile
    private var initializing = false

    private val localModelFile: File
        get() = File(context.filesDir, "models/gemma3-270m-it-q8.litertlm")

    @JavascriptInterface
    fun getStatus(): String {
        val localPresent = localModelFile.exists() && localModelFile.length() >= MIN_REAL_MODEL_BYTES
        val assetPresent = hasPackagedModel()
        return JSONObject()
            .put("available", true)
            .put("initialized", engine != null)
            .put("modelPresent", localPresent || assetPresent)
            .put("modelName", MODEL_NAME)
            .put(
                "message",
                when {
                    engine != null -> "Gemma is loaded entirely on-device."
                    initializing -> "Gemma is initializing on-device."
                    localPresent -> "Model is installed and ready to initialize."
                    assetPresent -> "Bundled model is ready to install into private app storage."
                    else -> "Bundled Gemma model not found. See BUILD_ANDROID_OFFLINE.md."
                },
            )
            .toString()
    }

    @JavascriptInterface
    fun initialize(requestId: String) {
        scope.launch {
            try {
                ensureEngine()
                callback(
                    requestId,
                    JSONObject()
                        .put("ok", true)
                        .put("modelName", MODEL_NAME),
                )
            } catch (t: Throwable) {
                callbackError(requestId, t)
            }
        }
    }

    @JavascriptInterface
    fun generate(requestId: String, payloadJson: String) {
        scope.launch {
            try {
                val payload = JSONObject(payloadJson)
                val systemInstruction = payload.optString(
                    "systemInstruction",
                    "You are Sivumi, a kind private on-device companion.",
                )
                val prompt = payload.getString("prompt")

                val localEngine = ensureEngine()
                val conversationConfig = ConversationConfig(
                    systemInstruction = Contents.of(systemInstruction),
                    samplerConfig = SamplerConfig(
                        topK = 40,
                        topP = 0.90,
                        temperature = 0.70,
                    ),
                )

                val text = localEngine.createConversation(conversationConfig).use { conversation ->
                    // sendMessage() is synchronous, but this method is already running in a
                    // background coroutine so the Android UI/WebView thread stays responsive.
                    conversation.sendMessage(prompt).toString().trim()
                }

                if (text.isBlank()) {
                    error("Gemma returned an empty response.")
                }

                callback(
                    requestId,
                    JSONObject()
                        .put("ok", true)
                        .put("text", text)
                        .put("modelName", MODEL_NAME),
                )
            } catch (t: Throwable) {
                callbackError(requestId, t)
            }
        }
    }

    private fun ensureEngine(): Engine {
        engine?.let { return it }

        synchronized(lock) {
            engine?.let { return it }
            initializing = true
            try {
                val model = ensureModelInstalled()
                Engine.setNativeMinLogSeverity(LogSeverity.ERROR)

                val threads = Runtime.getRuntime().availableProcessors().coerceIn(2, 6)
                val config = EngineConfig(
                    modelPath = model.absolutePath,
                    backend = Backend.CPU(threadCount = threads),
                    cacheDir = context.cacheDir.absolutePath,
                )

                return Engine(config).also {
                    it.initialize()
                    engine = it
                }
            } finally {
                initializing = false
            }
        }
    }

    private fun hasPackagedModel(): Boolean = try {
        context.assets.open(MODEL_ASSET).use { true }
    } catch (_: Throwable) {
        false
    }

    private fun ensureModelInstalled(): File {
        val target = localModelFile
        if (target.exists() && target.length() >= MIN_REAL_MODEL_BYTES) {
            return target
        }

        target.parentFile?.mkdirs()
        val temp = File(target.parentFile, target.name + ".copying")
        if (temp.exists()) temp.delete()

        try {
            context.assets.open(MODEL_ASSET).use { input ->
                FileOutputStream(temp).use { output ->
                    val buffer = ByteArray(8 * 1024 * 1024)
                    while (true) {
                        val count = input.read(buffer)
                        if (count <= 0) break
                        output.write(buffer, 0, count)
                    }
                    output.fd.sync()
                }
            }
        } catch (t: Throwable) {
            temp.delete()
            throw IllegalStateException(
                "The real $MODEL_ASSET file is not bundled in this APK.",
                t,
            )
        }

        if (temp.length() < MIN_REAL_MODEL_BYTES) {
            val actual = temp.length()
            temp.delete()
            throw IllegalStateException(
                "Bundled Gemma model is only $actual bytes. Expected the real q8 model (~304 MB).",
            )
        }

        if (target.exists()) target.delete()
        if (!temp.renameTo(target)) {
            temp.copyTo(target, overwrite = true)
            temp.delete()
        }
        return target
    }

    private fun callbackError(requestId: String, t: Throwable) {
        callback(
            requestId,
            JSONObject()
                .put("ok", false)
                .put("error", t.message ?: t.javaClass.simpleName)
                .put("modelName", MODEL_NAME),
        )
    }

    private fun callback(requestId: String, payload: JSONObject) {
        val requestLiteral = JSONObject.quote(requestId)
        val payloadLiteral = JSONObject.quote(payload.toString())
        webView.post {
            webView.evaluateJavascript(
                "window.__sivumiGemmaNativeCallback && " +
                    "window.__sivumiGemmaNativeCallback($requestLiteral, $payloadLiteral);",
                null,
            )
        }
    }

    fun close() {
        synchronized(lock) {
            engine?.close()
            engine = null
        }
        scope.cancel()
    }
}
