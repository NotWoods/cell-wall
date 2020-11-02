package com.tigeroakes.cellwallclient.data.rest

import retrofit2.http.GET

interface CellWallService {
  @GET("/v3/cellwall-version")
  suspend fun isCellWall(): CellWallVersion
}
