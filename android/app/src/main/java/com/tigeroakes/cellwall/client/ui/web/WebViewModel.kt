package com.tigeroakes.cellwall.client.ui.web

import android.Manifest
import android.app.Application
import android.content.Context
import android.content.pm.PackageManager
import android.content.pm.PackageManager.PERMISSION_GRANTED
import android.util.Log
import android.webkit.WebView
import androidx.core.content.ContextCompat
import androidx.core.net.toUri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.tigeroakes.cellwall.client.device.contentBlocking
import com.tigeroakes.cellwall.client.device.contentBlockingSettings
import com.tigeroakes.cellwall.client.device.geckoRuntimeSettings
import com.tigeroakes.cellwall.client.model.Event
import org.mozilla.geckoview.ContentBlocking
import org.mozilla.geckoview.GeckoRuntime
import org.mozilla.geckoview.GeckoRuntimeSettings
import org.mozilla.geckoview.GeckoSession

class WebViewModel(application: Application): AndroidViewModel(application), GeckoSession.PermissionDelegate {

  private var callback: GeckoSession.PermissionDelegate.Callback? = null
  private val _permissionRequests = MutableLiveData<Event<Array<out String>?>>(Event(null))

  val session = GeckoSession()
  val permissionRequests: LiveData<Event<Array<out String>?>> = _permissionRequests

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

    session.permissionDelegate = this
    session.open(runtime)
  }

  /**
   * Loads a URL in the [WebView]. If no data URI is specified, about:blank is displayed.
   */
  fun openUrl(url: String?) {
    val urlToOpen = if (url.isNullOrEmpty()) "about:blank" else url
    session.loadUri(urlToOpen)
  }

  fun onRequestPermissionsResult(grantResults: IntArray) {
    val callback = this.callback ?: return
    this.callback = null

    if (grantResults.any { it != PERMISSION_GRANTED }) {
      // At least one permission was not granted.
      callback.reject()
    } else {
      callback.grant()
    }
  }

  override fun onAndroidPermissionsRequest(
    session: GeckoSession,
    permissions: Array<out String>?,
    callback: GeckoSession.PermissionDelegate.Callback
  ) {
    this.callback = callback
    _permissionRequests.postValue(Event(permissions))
  }

  override fun onMediaPermissionRequest(
    session: GeckoSession,
    uri: String,
    video: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
    audio: Array<out GeckoSession.PermissionDelegate.MediaSource>?,
    callback: GeckoSession.PermissionDelegate.MediaCallback
  ) {
    // Reject permission if Android permission has been previously denied.
    if (audio != null && checkSelfPermission(Manifest.permission.RECORD_AUDIO)) {
      callback.reject()
    } else {
      // Auto grant first microphone
      callback.grant(null, audio?.first())
    }
  }

  private fun checkSelfPermission(permission: String): Boolean {
    return ContextCompat.checkSelfPermission(getApplication<Application>(), permission) != PERMISSION_GRANTED
  }
}
