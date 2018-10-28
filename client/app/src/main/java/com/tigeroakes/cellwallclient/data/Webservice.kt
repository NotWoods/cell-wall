package com.tigeroakes.cellwallclient.data

import com.tigeroakes.cellwallclient.model.*
import retrofit2.Call
import retrofit2.http.*
import java.util.*

interface Webservice {
    @GET("/is-cellwall-server")
    fun isCellWall(): Call<Unit>

    @GET("/wall/actions")
    fun getActions(): Call<List<Action>>

    @POST("/wall/actions")
    fun postAction(@Body action: ActionRequest): Call<Unit>

    @GET("/cell/{uuid}")
    fun getState(@Path("uuid") uuid: UUID): Call<CellState>

    @PUT("/cell/{uuid}")
    fun putCell(@Path("uuid") uuid: UUID, @Body cell: RegisterCellRequest): Call<Unit>
}