package com.sivumi.offline

import android.annotation.SuppressLint
import android.app.Activity
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat

class MainActivity : Activity() {

    companion object {

        private const val TAG =
            "SivumiWebView"

        private const val LOCAL_HOST =
            "appassets.androidplatform.net"

        private const val START_URL =
            "https://appassets.androidplatform.net/assets/www/index.html"
    }


    private lateinit var webView: WebView

    private lateinit var gemmaBridge: GemmaBridge


    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(
        savedInstanceState: Bundle?
    ) {

        super.onCreate(savedInstanceState)


        // ====================================================
        // WebView
        // ====================================================

        webView = WebView(this)

        setContentView(webView)


        // ====================================================
        // WebView settings
        // ====================================================

        webView.settings.apply {

            javaScriptEnabled = true

            domStorageEnabled = true

            allowFileAccess = false

            allowContentAccess = false

            cacheMode =
                WebSettings.LOAD_DEFAULT

            mixedContentMode =
                WebSettings.MIXED_CONTENT_NEVER_ALLOW

            mediaPlaybackRequiresUserGesture = true
        }


        // ====================================================
        // Serve APK assets through local HTTPS origin
        // ====================================================

        val assetLoader =
            WebViewAssetLoader
                .Builder()
                .addPathHandler(
                    "/assets/",
                    WebViewAssetLoader.AssetsPathHandler(
                        this
                    )
                )
                .build()


        // ====================================================
        // WebView client
        // ====================================================

        webView.webViewClient =
            object : WebViewClientCompat() {


                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest
                ): WebResourceResponse? {

                    return assetLoader
                        .shouldInterceptRequest(
                            request.url
                        )
                }


                @Suppress("DEPRECATION")
                override fun shouldInterceptRequest(
                    view: WebView,
                    url: String
                ): WebResourceResponse? {

                    return assetLoader
                        .shouldInterceptRequest(
                            Uri.parse(url)
                        )
                }


                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    request: WebResourceRequest
                ): Boolean {

                    return !isLocalUrl(
                        request.url
                    )
                }


                @Suppress("DEPRECATION")
                override fun shouldOverrideUrlLoading(
                    view: WebView,
                    url: String
                ): Boolean {

                    return !isLocalUrl(
                        Uri.parse(url)
                    )
                }


                override fun onPageFinished(
                    view: WebView,
                    url: String
                ) {

                    super.onPageFinished(
                        view,
                        url
                    )


                    Log.i(
                        TAG,
                        "Page finished: $url"
                    )


                    /*
                     * Debug React status.
                     *
                     * This lets adb logcat tell us whether
                     * React rendered anything into #root.
                     */
                    view.evaluateJavascript(
                        """
                        (() => {

                            const root =
                                document.getElementById('root');

                            return JSON.stringify({
                                href:
                                    location.href,

                                rootExists:
                                    !!root,

                                rootLength:
                                    root?.innerHTML?.length || 0,

                                bodyLength:
                                    document.body?.innerHTML?.length || 0
                            });

                        })();
                        """.trimIndent()
                    ) { result ->

                        Log.i(
                            TAG,
                            "DOM status: $result"
                        )
                    }
                }
            }


        // ====================================================
        // Forward JavaScript console into adb logcat
        // ====================================================

        webView.webChromeClient =
            object : WebChromeClient() {

                override fun onConsoleMessage(
                    consoleMessage: ConsoleMessage
                ): Boolean {

                    Log.e(
                        TAG,
                        "JS: " +
                            consoleMessage.message() +
                            " | line=" +
                            consoleMessage.lineNumber() +
                            " | source=" +
                            consoleMessage.sourceId()
                    )

                    return true
                }
            }


        // ====================================================
        // Native Gemma bridge
        // ====================================================

        gemmaBridge =
            GemmaBridge(
                this,
                webView
            )


        webView.addJavascriptInterface(
            gemmaBridge,
            "SivumiGemma"
        )


        // ====================================================
        // Load React app
        // ====================================================

        Log.i(
            TAG,
            "Loading: $START_URL"
        )


        webView.loadUrl(
            START_URL
        )
    }


    // ========================================================
    // Restrict WebView navigation to bundled content
    // ========================================================

    private fun isLocalUrl(
        uri: Uri?
    ): Boolean {

        if (uri == null) {

            return false
        }


        return (
            uri.scheme == "https" &&
            uri.host == LOCAL_HOST
        )
    }


    // ========================================================
    // Cleanup
    // ========================================================

    override fun onDestroy() {

        if (::gemmaBridge.isInitialized) {

            gemmaBridge.close()
        }


        if (::webView.isInitialized) {

            webView.removeJavascriptInterface(
                "SivumiGemma"
            )

            webView.destroy()
        }


        super.onDestroy()
    }
}
