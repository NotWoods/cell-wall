package com.tigeroakes.cellwall.client.data

import android.content.Context
import android.net.Uri
import android.os.Build
import androidx.annotation.Keep
import androidx.core.net.toUri
import com.tigeroakes.cellwall.client.data.prefs.settingsDataStore
import com.tigeroakes.cellwall.client.device.CellInfo
import kotlinx.coroutines.flow.map

@Keep
class CellWallRepository(context: Context) {

  companion object {
    @JvmStatic
    private var instance: CellWallRepository? = null

    @JvmStatic
    fun get(context: Context): CellWallRepository {
      if (instance != null) return instance!!
      return CellWallRepository(context.applicationContext).also { instance = it }
    }
  }

  private val settings = context.settingsDataStore

  val serverAddress = settings.data
    .map { settings -> settings.serverAddress.takeIf { it.isNotEmpty() } }
  val serial = settings.data
    .map { settings -> settings.serial ?: Build.UNKNOWN }
  val isUrlSaved = serverAddress.map { !it.isNullOrEmpty() }

  suspend fun attemptToConnect(address: String): Uri {
    val url = address.toUri()
    settings.updateData { settings ->
      settings.toBuilder().setServerAddress(url.toString()).build()
    }
    return url
  }

  suspend fun register(serial: String, info: CellInfo) {
    settings.updateData { settings ->
      settings.toBuilder().setSerial(serial).build()
    }
  }
}
