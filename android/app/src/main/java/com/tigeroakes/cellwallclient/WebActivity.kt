package com.tigeroakes.cellwallclient

import android.content.Intent
import android.os.Build.VERSION_CODES
import android.os.Build.VERSION.SDK_INT
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View.*
import android.webkit.WebView

/**
 * Basic WebView to link to the actual server. Started with an intent.
 * adb shell am start -a "com.tigeroakes.cellwallclient.VIEW" -d "https://example.com"
 */
class WebActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupWebView(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setupWebView(intent)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) enterImmersiveMode()
    }

    /**
     * Specifies [WebView] settings and loads a URL.
     *
     * The URL is pulled from the data string. If no data URI is specified, about:blank is displayed.
     */
    @Suppress("SetJavascriptEnabled")
    private fun setupWebView(intent: Intent?) = findViewById<WebView>(R.id.webView).apply {
        settings.javaScriptEnabled = true

        val url = intent?.dataString?.ifEmpty { null }
        loadUrl(url ?: "about:blank")
    }

    /**
     * Hides system bars.
     * https://developer.android.com/training/system-ui/immersive
     */
    private fun enterImmersiveMode() {
        var visibilityFlags = SYSTEM_UI_FLAG_HIDE_NAVIGATION
        if (SDK_INT >= VERSION_CODES.JELLY_BEAN) {
            visibilityFlags = visibilityFlags or
                    SYSTEM_UI_FLAG_LAYOUT_STABLE or
                    SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                    SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                    SYSTEM_UI_FLAG_FULLSCREEN
        }
        if (SDK_INT >= VERSION_CODES.KITKAT) {
            visibilityFlags = visibilityFlags or SYSTEM_UI_FLAG_IMMERSIVE
        }
        window.decorView.systemUiVisibility = visibilityFlags

    }
}
