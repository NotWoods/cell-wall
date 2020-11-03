package com.tigeroakes.cellwallclient.data.rest

import com.tigeroakes.cellwallclient.device.CellInfo
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.PUT
import retrofit2.http.Path

interface CellWallService {
  @GET("/v3/cellwall-version")
  suspend fun isCellWall(): CellWallVersion

  @PUT("/v3/cell/{serial}")
  suspend fun putCell(
    @Path("serial") serial: String,
    @Body cell: CellInfo
  )
}
