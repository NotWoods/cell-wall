package com.tigeroakes.cellwallclient.data.rest

import okhttp3.OkHttpClient
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

object ServiceGenerator {
    var apiBaseUrl: String = "http://10.0.2.2/"

    private val httpClient: OkHttpClient = OkHttpClient.Builder()
            .addInterceptor { chain ->
                val original = chain.request()

                val url = original.url().newBuilder()
                        .host(apiBaseUrl)
                        .build()
                val request = original.newBuilder()
                        .url(url)
                        .build()

                chain.proceed(request)
            }
            .build()

    private val retrofit = Retrofit.Builder()
            .addConverterFactory(GsonConverterFactory.create())
            .baseUrl(apiBaseUrl)
            .client(httpClient)
            .build()

    fun <S> createService(serviceClass: Class<S>): S = retrofit.create(serviceClass)

    fun createValidator() = ServerUrlValidator(httpClient)
}