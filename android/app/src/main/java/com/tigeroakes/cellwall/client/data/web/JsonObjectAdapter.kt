package com.tigeroakes.cellwall.client.data.web

import com.tinder.scarlet.Message
import com.tinder.scarlet.MessageAdapter
import okhttp3.ResponseBody
import org.json.JSONException
import org.json.JSONObject
import retrofit2.Converter
import java.io.IOException

object JsonObjectAdapter : Converter<ResponseBody, JSONObject?>, MessageAdapter<JSONObject> {

  @Throws(IOException::class)
  override fun convert(value: ResponseBody): JSONObject? {
    return try {
      JSONObject(value.string())
    } catch (e: JSONException) {
      e.printStackTrace()
      null
    }
  }

  override fun fromMessage(message: Message) = when (message) {
    is Message.Text -> JSONObject(message.value)
    else -> throw IllegalArgumentException("This Message Adapter only supports text Messages")
  }

  override fun toMessage(data: JSONObject) = Message.Text(data.toString())
}
