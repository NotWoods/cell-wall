package com.tigeroakes.cellwallclient.data.rest

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.net.URI

object ServiceGenerator {
    var apiBaseUrl: URI = URI("http://10.0.2.2:3000/")
    private val port: Int
        get() {
            if (apiBaseUrl.port > -1) return apiBaseUrl.port
            return when (apiBaseUrl.scheme) {
                "http" -> 80
                "https" -> 443
                else -> throw Exception("Invalid scheme ${apiBaseUrl.scheme}")
            }
        }

    private val httpClient: OkHttpClient = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()

                val url = original.url().newBuilder()
                        .scheme(apiBaseUrl.scheme)
                        .host(apiBaseUrl.host)
                        .port(port)
                        .build()
                val request = original.newBuilder()
                        .url(url)
                        .build()

                chain.proceed(request)
            }
            .build()

    private val retrofit = Retrofit.Builder()
            .addConverterFactory(GsonConverterFactory.create())
            .baseUrl(apiBaseUrl.toString())
            .client(httpClient)
            .build()

    fun <S> createService(serviceClass: Class<S>): S = retrofit.create(serviceClass)
}