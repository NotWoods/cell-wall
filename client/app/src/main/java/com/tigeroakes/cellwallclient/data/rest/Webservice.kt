package com.tigeroakes.cellwallclient.data.rest

import com.tigeroakes.cellwallclient.model.Action
import com.tigeroakes.cellwallclient.model.ActionRequest
import com.tigeroakes.cellwallclient.model.CellInfo
import com.tigeroakes.cellwallclient.model.CellState
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
    fun putCell(@Path("uuid") uuid: UUID, @Body cell: CellInfo): Call<Unit>
}