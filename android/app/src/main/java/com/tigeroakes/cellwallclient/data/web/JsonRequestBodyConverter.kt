package com.tigeroakes.cellwallclient.data.web

import okhttp3.MediaType
import okhttp3.RequestBody
import retrofit2.Converter
import java.io.IOException

object JsonRequestBodyConverter : Converter<Any, RequestBody> {

  @Throws(IOException::class)
  override fun convert(value: Any): RequestBody {
    return RequestBody.create(MEDIA_TYPE, value.toString())
  }

  private val MEDIA_TYPE: MediaType = MediaType.parse("application/json; charset=UTF-8")!!
}
