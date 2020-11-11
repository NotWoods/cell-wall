package com.tigeroakes.cellwallclient.data.web

import com.tinder.scarlet.MessageAdapter
import com.tinder.scarlet.utils.getRawType
import okhttp3.RequestBody
import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONObject
import retrofit2.Converter
import retrofit2.Retrofit
import java.lang.reflect.Type

object JsonAdapterFactory : Converter.Factory(), MessageAdapter.Factory {

  override fun create(type: Type, annotations: Array<Annotation>): MessageAdapter<*> =
    when (type.getRawType()) {
      JSONObject::class.java -> JsonObjectAdapter
      JSONArray::class.java -> JsonArrayAdapter
      else -> throw IllegalArgumentException("Type is not supported by this MessageAdapterFactory: $type")
    }

  override fun requestBodyConverter(
    type: Type,
    parameterAnnotations: Array<Annotation>,
    methodAnnotations: Array<Annotation>,
    retrofit: Retrofit
  ): Converter<*, RequestBody>? {
    return if (type == JSONObject::class.java || type == JSONArray::class.java) {
      JsonRequestBodyConverter
    } else {
      null
    }
  }

  override fun responseBodyConverter(
    type: Type,
    annotations: Array<Annotation>,
    retrofit: Retrofit
  ): Converter<ResponseBody, *>? {
    return when (type) {
      JSONObject::class.java -> JsonObjectAdapter
      JSONArray::class.java -> JsonArrayAdapter
      else -> null
    }
  }
}
