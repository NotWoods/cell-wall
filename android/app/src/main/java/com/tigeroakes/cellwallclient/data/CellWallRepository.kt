package com.tigeroakes.cellwallclient.data

import android.content.Context
import android.net.Uri
import com.tigeroakes.cellwallclient.data.prefs.Settings
import com.tigeroakes.cellwallclient.data.rest.CellWallService
import com.tigeroakes.cellwallclient.data.rest.Reason
import com.tigeroakes.cellwallclient.data.rest.ServerUrlValidator
import com.tigeroakes.cellwallclient.data.socket.CellWallSocketService
import com.tigeroakes.cellwallclient.data.web.ServiceGenerator
import com.tigeroakes.cellwallclient.device.CellInfo
import com.tigeroakes.cellwallclient.model.CellState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.withContext
import retrofit2.create

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

  private val serviceGenerator = ServiceGenerator()
  private val webService = serviceGenerator.retrofit.create<CellWallService>()
  private val socketService = serviceGenerator.scarlet.create<CellWallSocketService>()
  private val settings = Settings(context)

  val serverAddress = settings.serverAddress.asFlow()
    .map { address -> address.takeIf { it.isNotEmpty() } }
  val serial = settings.serial.asFlow()
  val isUrlSaved = serverAddress.map { !it.isNullOrEmpty() }

  suspend fun attemptToConnect(address: String): Uri {
    val lastUrl = serviceGenerator.apiBaseUrl

    val url = ServerUrlValidator.guessUri(address)
    serviceGenerator.apiBaseUrl = url

    val response = try {
      webService.isCellWall()
    } catch (err: Throwable) {
      serviceGenerator.apiBaseUrl = lastUrl
      throw ServerUrlValidator.ValidationException(Reason.PATH_DOES_NOT_EXIST)
    }
    if (!response.isSuccessful) {
      throw ServerUrlValidator.ValidationException(Reason.PATH_RETURNED_ERROR)
    }

    withContext(Dispatchers.IO) {
      settings.serverAddress.set(url.toString())
    }
    return url
  }

  suspend fun register(serial: String, info: CellInfo) {
    webService.putCell(serial, info.toJson())
    withContext(Dispatchers.IO) {
      settings.serial.set(serial)
    }
  }

  fun observeState(): Flow<CellState> {
    return socketService.observeState()
      .receiveAsFlow()
      .map { CellState.from(it) }
  }
}
