package com.tigeroakes.cellwall.client.device

import org.json.JSONObject

data class CellInfo(
  val deviceName: String,
  val density: Int,
  val widthPixels: Int,
  val heightPixels: Int
) {
  fun toJson() = JSONObject().apply {
    put("deviceName", deviceName)
    put("density", density)
    put("widthPixels", widthPixels)
    put("heightPixels", heightPixels)
  }
}
