package com.tigeroakes.cellwallclient

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.webkit.WebView

class WebActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setupWebView()
    }

    @Suppress("SetJavascriptEnabled")
    private fun setupWebView() = findViewById<WebView>(R.id.webView).apply {
        settings.javaScriptEnabled = true

        loadUrl(intent.dataString)
    }
}
