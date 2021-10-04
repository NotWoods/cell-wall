package com.tigeroakes.cellwall.client.data.rest

import org.json.JSONObject
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path

interface CellWallService {
  @GET("/api/cellwall-version")
  suspend fun isCellWall(): Response<JSONObject>

  @PUT("/api/device/{serial}")
  suspend fun putCell(
    @Path("serial") serial: String,
    @Body cell: JSONObject
  )
}
