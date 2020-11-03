package com.tigeroakes.cellwallclient.data.rest

import okhttp3.MediaType
import okhttp3.RequestBody
import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject
import retrofit2.Converter
import retrofit2.Retrofit
import java.io.IOException
import java.lang.reflect.Type


class JsonConverterFactory : Converter.Factory() {

  override fun requestBodyConverter(
    type: Type,
    parameterAnnotations: Array<Annotation>,
    methodAnnotations: Array<Annotation>,
    retrofit: Retrofit
  ): Converter<*, RequestBody>? {
    if (type == JSONObject::class.java || type == JSONArray::class.java) {
      return JsonRequestBodyConverter.INSTANCE
    }
    return null
  }

  override fun responseBodyConverter(
    type: Type,
    annotations: Array<Annotation>,
    retrofit: Retrofit
  ): Converter<ResponseBody, *>? {
    return when (type) {
      JSONObject::class.java -> JsonObjectResponseBodyConverter
      JSONArray::class.java -> JsonArrayResponseBodyConverter
      else -> null
    }
  }
}

internal class JsonRequestBodyConverter<T> private constructor() : Converter<T, RequestBody> {

  @Throws(IOException::class)
  override fun convert(value: T): RequestBody {
    return RequestBody.create(MEDIA_TYPE, value.toString())
  }

  companion object {
    val INSTANCE = JsonRequestBodyConverter<Any>()
    private val MEDIA_TYPE: MediaType = MediaType.parse("text/plain; charset=UTF-8")!!
  }
}

object JsonObjectResponseBodyConverter : Converter<ResponseBody, JSONObject?> {

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

object JsonArrayResponseBodyConverter : Converter<ResponseBody, JSONArray?> {

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
