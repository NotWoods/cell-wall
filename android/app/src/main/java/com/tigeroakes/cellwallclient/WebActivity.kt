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

    private lateinit var webView: WebViewController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = WebViewController(findViewById(R.id.webView))

        webView.processIntent(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)

        webView.processIntent(intent)
    }

    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) Immersive.enterImmersiveMode(window)
    }

}
