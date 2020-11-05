package com.tigeroakes.cellwallclient.ui.web

import android.webkit.WebView

class WebViewController(private val webView: WebView) {

  init {
    @Suppress("SetJavascriptEnabled")
    webView.settings.javaScriptEnabled = true
  }

  /**
   * Loads a URL in the [WebView]. If no data URI is specified, about:blank is displayed.
   */
  fun openUrl(url: String?) {
    val urlToOpen = if (url.isNullOrEmpty()) "about:blank" else url
    webView.loadUrl(urlToOpen)
  }

  /**
   * Reloads the current page.
   */
  fun reload() = webView.reload()
}
