package com.sivumi.offline

import android.annotation.SuppressLint
import android.app.Activity
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var gemmaBridge: GemmaBridge

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_NEVER_ALLOW
            mediaPlaybackRequiresUserGesture = true
        }

        // The application is deliberately local-only. Do not enable universal
        // file URL access: the UI should only read its own packaged assets.
        @Suppress("DEPRECATION")
        webView.settings.allowUniversalAccessFromFileURLs = false

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                // Do not navigate to remote pages from this private offline app.
                return url?.startsWith("file:///android_asset/") != true
            }
        }
        webView.webChromeClient = WebChromeClient()

        gemmaBridge = GemmaBridge(this, webView)
        webView.addJavascriptInterface(gemmaBridge, "SivumiGemma")
        webView.loadUrl("file:///android_asset/www/index.html")
    }

    override fun onDestroy() {
        gemmaBridge.close()
        webView.removeJavascriptInterface("SivumiGemma")
        webView.destroy()
        super.onDestroy()
    }
}
