package com.tigeroakes.cellwallclient.data.web

import androidx.core.net.toUri
import com.tinder.scarlet.websocket.okhttp.request.RequestFactory
import okhttp3.Request

class DynamicUrlRequestFactory(
  var scheme: String = "http"
) : RequestFactory {

  var baseUrl = "http://10.0.2.2:3000/".toUri()

  override fun createRequest(): Request {
    return Request.Builder()
      .url(baseUrl.toString())
      .build()
  }

  fun createRequest(original: Request): Request {
    val url = original.url().newBuilder()
      .scheme(scheme)
      .host(baseUrl.host!!)
      .port(baseUrl.port)
      .build()

    return original.newBuilder()
      .url(url)
      .build()
  }
}
