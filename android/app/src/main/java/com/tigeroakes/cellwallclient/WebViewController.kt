package com.tigeroakes.cellwallclient

import android.content.Intent
import android.content.Intent.ACTION_MAIN
import android.webkit.WebView

class WebViewController(private val webView: WebView) {

    init {
        @Suppress("SetJavascriptEnabled")
        webView.settings.javaScriptEnabled = true
    }

    /**
     * Loads a URL in the [WebView]. If no data URI is specified, about:blank is displayed.
     */
    private fun openUrl(url: String?) {
        val urlToOpen = if (url.isNullOrEmpty()) "about:blank" else url
        webView.loadUrl(urlToOpen)
    }

    /**
     * Reloads the current page.
     */
    private fun reload() = webView.reload()

    fun processIntent(intent: Intent?) {
        when (intent?.action) {
            ACTION_RELOAD -> reload()
            ACTION_VIEW, ACTION_MAIN -> openUrl(intent.dataString?.ifEmpty { null })
        }
    }

    companion object {
        internal const val ACTION_VIEW = "com.tigeroakes.cellwallclient.VIEW"
        internal const val ACTION_RELOAD = "com.tigeroakes.cellwallclient.RELOAD"
    }
}
