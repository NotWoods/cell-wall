package com.tigeroakes.cellwallclient.data.prefs

import android.content.Context
import androidx.datastore.CorruptionException
import androidx.datastore.Serializer
import androidx.datastore.createDataStore
import com.google.protobuf.InvalidProtocolBufferException
import com.tigeroakes.cellwallclient.Settings
import java.io.InputStream
import java.io.OutputStream

object SettingsSerializer : Serializer<Settings> {
  override fun readFrom(input: InputStream): Settings {
    try {
      return Settings.parseFrom(input)
    } catch (err: InvalidProtocolBufferException) {
      throw CorruptionException("Cannot read proto.", err)
    }
  }

  override fun writeTo(t: Settings, output: OutputStream) {
    t.writeTo(output)
  }

  fun createDataStore(context: Context) = context.createDataStore(
    fileName = "settings.proto",
    serializer = SettingsSerializer
  )
}
