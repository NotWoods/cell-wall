package com.tigeroakes.cellwall.client.data

import android.content.Context
import android.net.Uri
import androidx.annotation.Keep
import androidx.core.net.toUri
import com.tigeroakes.cellwall.client.data.prefs.Settings
import com.tigeroakes.cellwall.client.data.rest.CellWallService
import com.tigeroakes.cellwall.client.data.rest.Reason
import com.tigeroakes.cellwall.client.data.rest.ServerUrlValidator
import com.tigeroakes.cellwall.client.data.web.ServiceGenerator
import com.tigeroakes.cellwall.client.device.CellInfo
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import retrofit2.create

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

  private val settings = Settings(context)

  val serverAddress = settings.serverAddress.asFlow()
    .map { address -> address.takeIf { it.isNotEmpty() } }
  val serial = settings.serial.asFlow()
  val isUrlSaved = serverAddress.map { !it.isNullOrEmpty() }

  suspend fun attemptToConnect(address: String): Uri {
    val url = address.toUri()

    withContext(Dispatchers.IO) {
      settings.serverAddress.set(url.toString())
    }
    return url
  }

  suspend fun register(serial: String, info: CellInfo) {
    withContext(Dispatchers.IO) {
      settings.serial.set(serial)
    }
  }
}
