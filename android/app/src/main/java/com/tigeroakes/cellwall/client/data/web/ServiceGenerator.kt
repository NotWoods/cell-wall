package com.tigeroakes.cellwall.client.data.web

import androidx.core.net.toUri
import okhttp3.OkHttpClient
import retrofit2.Retrofit

class ServiceGenerator {

  var apiBaseUrl = "http://10.0.2.2:3000/".toUri()

  private val httpClient: OkHttpClient = OkHttpClient.Builder()
    .addInterceptor { chain ->
      val original = chain.request()
      val url = original.url().newBuilder()
        .scheme(apiBaseUrl.scheme!!)
        .host(apiBaseUrl.host!!)
        .port(apiBaseUrl.port)
        .build()
      val request = original.newBuilder()
        .url(url)
        .build()
      chain.proceed(request)
    }
    .build()

  val retrofit: Retrofit = Retrofit.Builder()
    .addConverterFactory(JsonAdapterFactory)
    .baseUrl(apiBaseUrl.toString())
    .client(httpClient)
    .build()

  fun <S> createService(serviceClass: Class<S>): S = retrofit.create(serviceClass)
}
