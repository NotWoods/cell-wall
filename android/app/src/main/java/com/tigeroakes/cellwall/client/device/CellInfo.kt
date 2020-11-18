package com.tigeroakes.cellwall.client.device

import org.json.JSONObject

data class CellInfo(
  val deviceName: String,
  val density: Float,
  val widthPixels: Int,
  val heightPixels: Int
) {

  val width = (widthPixels / density).toInt()
  val height = (heightPixels / density).toInt()

  fun toJson() = JSONObject().apply {
    put("deviceName", deviceName)
    put("density", density)
    put("widthPixels", widthPixels)
    put("heightPixels", heightPixels)
  }
}
