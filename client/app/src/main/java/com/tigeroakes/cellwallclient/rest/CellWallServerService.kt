package com.tigeroakes.cellwallclient.rest

import retrofit2.Call
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.GET
import retrofit2.http.Path

interface CellWallServerService {
    @GET("is-cellwall-server")
    fun isServer(): Call<Unit>

    @GET("data/CONFIGURE/{id}")
    fun getConfigureData(@Path("id") id: String): Call<Data.Configure>

    @GET("data/TEXT/{id}")
    fun getTextData(@Path("id") id: String): Call<Data.Text>

    @GET("data/IMAGE/{id}")
    fun getImageData(@Path("id") id: String): Call<Data.Image>

    @GET("data/BUTTON/{id}")
    fun getButtonData(@Path("id") id: String): Call<Data.Button>

    companion object {
        fun create(serverAddress: String): CellWallServerService {
            val retrofit = Retrofit.Builder()
                    .baseUrl(serverAddress)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build()
            return retrofit.create(CellWallServerService::class.java)
        }
    }
}
