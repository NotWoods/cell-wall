package com.tigeroakes.cellwallclient.data.web

import android.net.Uri
import com.tinder.scarlet.Scarlet
import com.tinder.scarlet.websocket.okhttp.newWebSocketFactory
import com.tinder.streamadapter.coroutines.CoroutinesStreamAdapterFactory
import okhttp3.OkHttpClient
import retrofit2.Retrofit

class ServiceGenerator {

  private val httpRequestFactory = DynamicUrlRequestFactory()
  private val webSocketRequestFactory = DynamicUrlRequestFactory("wss")

  var apiBaseUrl: Uri
    get() = httpRequestFactory.baseUrl
    set(value) {
      httpRequestFactory.baseUrl = value
      httpRequestFactory.scheme = value.scheme!!
      webSocketRequestFactory.baseUrl = value
    }

  private val httpClient: OkHttpClient = OkHttpClient.Builder()
    .addInterceptor { chain ->
      val original = chain.request()
      val request = httpRequestFactory.createRequest(original)
      chain.proceed(request)
    }
    .build()

  val retrofit = Retrofit.Builder()
    .addConverterFactory(JsonAdapterFactory)
    .baseUrl(apiBaseUrl.toString())
    .client(httpClient)
    .build()

  val scarlet = Scarlet.Builder()
    .webSocketFactory(httpClient.newWebSocketFactory(webSocketRequestFactory))
    .addMessageAdapterFactory(JsonAdapterFactory)
    .addStreamAdapterFactory(CoroutinesStreamAdapterFactory())
    .build()

  fun <S> createService(serviceClass: Class<S>): S = retrofit.create(serviceClass)
}
