package com.tigeroakes.cellwall.client.ui.web

import android.app.Application
import android.webkit.WebView
import androidx.lifecycle.AndroidViewModel
import com.tigeroakes.cellwall.client.device.contentBlocking
import com.tigeroakes.cellwall.client.device.contentBlockingSettings
import com.tigeroakes.cellwall.client.device.geckoRuntimeSettings
import org.mozilla.geckoview.ContentBlocking
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoRuntimeSettings
import org.mozilla.geckoview.GeckoSession

class WebViewModel(application: Application): AndroidViewModel(application) {

  val session = GeckoSession()

  init {
    val runtime = GeckoRuntime.create(application, geckoRuntimeSettings {
      configFilePath("")
      doubleTapZoomingEnabled(false)
      webManifest(false)
      contentBlocking {
        antiTracking(ContentBlocking.AntiTracking.STRICT)
        cookieBehavior(ContentBlocking.CookieBehavior.ACCEPT_NON_TRACKERS)
        cookiePurging(true)
        enhancedTrackingProtectionLevel(ContentBlocking.EtpLevel.STRICT)
        strictSocialTrackingProtection(true)
      }
    })

    session.open(runtime)
  }

  /**
   * Loads a URL in the [WebView]. If no data URI is specified, about:blank is displayed.
   */
  fun openUrl(url: String?) {
    val urlToOpen = if (url.isNullOrEmpty()) "about:blank" else url
    session.loadUri(urlToOpen)
  }
}
