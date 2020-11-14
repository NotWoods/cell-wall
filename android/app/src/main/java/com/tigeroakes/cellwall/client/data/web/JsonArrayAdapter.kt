package com.tigeroakes.cellwall.client.data.web

import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONException
import retrofit2.Converter
import java.io.IOException

object JsonArrayAdapter : Converter<ResponseBody, JSONArray?> {

  @Throws(IOException::class)
  override fun convert(value: ResponseBody): JSONArray? {
    return try {
      JSONArray(value.string())
    } catch (e: JSONException) {
      e.printStackTrace()
      null
    }
  }
}
