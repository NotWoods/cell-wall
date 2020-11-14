package com.tigeroakes.cellwall.client.ui.web

import android.webkit.WebView
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoRuntimeSettings
import org.mozilla.geckoview.GeckoSession
import org.mozilla.geckoview.GeckoView

class WebViewController(webView: GeckoView) {

  private val session = GeckoSession()

  init {
    val settings = GeckoRuntimeSettings.Builder()
      .configFilePath("")
      .build()
    val runtime = GeckoRuntime.create(webView.context, settings)

    session.open(runtime)
    webView.setSession(session)
  }

  /**
   * Loads a URL in the [WebView]. If no data URI is specified, about:blank is displayed.
   */
  fun openUrl(url: String?) {
    val urlToOpen = if (url.isNullOrEmpty()) "about:blank" else url
    session.loadUri(urlToOpen)
  }

  /**
   * Reloads the current page.
   */
  // fun reload() = webView.reload()
}