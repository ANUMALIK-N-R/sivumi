package com.sivumi.offline

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Color
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.widget.FrameLayout

import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
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


    private lateinit var rootContainer: FrameLayout

    private lateinit var webView: WebView

    private lateinit var gemmaBridge: GemmaBridge


    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(
        savedInstanceState: Bundle?
    ) {

        super.onCreate(savedInstanceState)


        // ====================================================
        // Android 15+ uses edge-to-edge by default.
        //
        // Explicitly enable it on all supported Android
        // versions so inset behavior stays consistent.
        // ====================================================

        WindowCompat.enableEdgeToEdge(window)


        // ====================================================
        // System-bar icon appearance
        //
        // Sivumi uses a light background, so use dark icons
        // in the status/navigation bars.
        // ====================================================

        WindowCompat
            .getInsetsController(
                window,
                window.decorView
            )
            .apply {

                isAppearanceLightStatusBars = true

                isAppearanceLightNavigationBars = true
            }


        // ====================================================
        // Root container
        //
        // System insets are applied HERE rather than using
        // hard-coded CSS padding.
        //
        // Therefore the whole WebView automatically avoids:
        //
        // - status bar
        // - camera notch / display cutout
        // - navigation bar
        // - gesture navigation area
        // ====================================================

        rootContainer =
            FrameLayout(this).apply {

                setBackgroundColor(
                    Color.rgb(
                        250,
                        248,
                        245
                    )
                )
            }


        setContentView(
            rootContainer
        )


        // ====================================================
        // Apply Android system-safe areas
        // ====================================================

        ViewCompat.setOnApplyWindowInsetsListener(
            rootContainer
        ) { view, windowInsets ->


            val safeInsets =
                windowInsets.getInsets(

                    WindowInsetsCompat.Type.systemBars() or

                    WindowInsetsCompat.Type.displayCutout()
                )


            // ------------------------------------------------
            // Keep the ENTIRE application UI inside
            // Android's safe area.
            // ------------------------------------------------

            view.setPadding(
                safeInsets.left,
                safeInsets.top,
                safeInsets.right,
                safeInsets.bottom
            )


            Log.i(
                TAG,
                "System insets: " +
                    "left=${safeInsets.left}, " +
                    "top=${safeInsets.top}, " +
                    "right=${safeInsets.right}, " +
                    "bottom=${safeInsets.bottom}"
            )


            windowInsets
        }


        // ====================================================
        // WebView
        // ====================================================

        webView =
            WebView(this).apply {

                setBackgroundColor(
                    Color.rgb(
                        250,
                        248,
                        245
                    )
                )
            }


        rootContainer.addView(
            webView,
            FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        )


        // Request the initial inset calculation.
        ViewCompat.requestApplyInsets(
            rootContainer
        )


        // ====================================================
        // WebView settings
        // ====================================================

        webView.settings.apply {

            javaScriptEnabled = true

            domStorageEnabled = true


            /*
             * We use WebViewAssetLoader instead of file://.
             */
            allowFileAccess = false

            allowContentAccess = false


            cacheMode =
                WebSettings.LOAD_DEFAULT


            mixedContentMode =
                WebSettings.MIXED_CONTENT_NEVER_ALLOW


            mediaPlaybackRequiresUserGesture = true
        }


        // ====================================================
        // Local WebView asset server
        //
        // This is NOT Internet access.
        //
        // Files are served directly from the APK.
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


                // ============================================
                // Prevent navigation outside the offline app
                // ============================================

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


                    // ========================================
                    // Debug React rendering
                    // ========================================

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
        // JavaScript console -> adb logcat
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
        // Gemma native bridge
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
        // Load Sivumi
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
    // Only allow the bundled local WebView origin
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
