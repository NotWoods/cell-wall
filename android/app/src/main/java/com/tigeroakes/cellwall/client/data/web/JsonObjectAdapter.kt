package com.tigeroakes.cellwall.client.data.web

import okhttp3.ResponseBody
import org.json.JSONException
import org.json.JSONObject
import retrofit2.Converter
import java.io.IOException

object JsonObjectAdapter : Converter<ResponseBody, JSONObject?> {

  @Throws(IOException::class)
  override fun convert(value: ResponseBody): JSONObject? {
    return try {
      JSONObject(value.string())
    } catch (e: JSONException) {
      e.printStackTrace()
      null
    }
  }
}
