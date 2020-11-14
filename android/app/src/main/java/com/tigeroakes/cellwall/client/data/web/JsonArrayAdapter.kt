package com.tigeroakes.cellwall.client.data.web

import com.tinder.scarlet.Message
import com.tinder.scarlet.MessageAdapter
import okhttp3.ResponseBody
import org.json.JSONArray
import org.json.JSONException
import retrofit2.Converter
import java.io.IOException

object JsonArrayAdapter : Converter<ResponseBody, JSONArray?>, MessageAdapter<JSONArray> {

  @Throws(IOException::class)
  override fun convert(value: ResponseBody): JSONArray? {
    return try {
      JSONArray(value.string())
    } catch (e: JSONException) {
      e.printStackTrace()
      null
    }
  }

  override fun fromMessage(message: Message) = when (message) {
    is Message.Text -> JSONArray(message.value)
    else -> throw IllegalArgumentException("This Message Adapter only supports text Messages")
  }

  override fun toMessage(data: JSONArray) = Message.Text(data.toString())
}
