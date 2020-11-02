package com.tigeroakes.cellwallclient.data

import android.content.Context
import com.tigeroakes.cellwallclient.data.prefs.SettingsSerializer
import com.tigeroakes.cellwallclient.data.rest.CellWallService
import com.tigeroakes.cellwallclient.data.rest.Reason
import com.tigeroakes.cellwallclient.data.rest.ServerUrlValidator
import com.tigeroakes.cellwallclient.data.rest.ServiceGenerator
import com.tigeroakes.cellwallclient.device.CellInfo
import kotlinx.coroutines.flow.map
import java.net.URI

class CellWallRepository(context: Context) {

  private val dataStore = SettingsSerializer.createDataStore(context)
  private val webService = ServiceGenerator.createService(CellWallService::class.java)

  val isUrlSaved = dataStore.data.map { it.serverAddress.isNotEmpty() }

  suspend fun attemptToConnect(address: String): URI {
    val lastUrl = ServiceGenerator.apiBaseUrl

    val url = ServerUrlValidator.guessUri(address)
    ServiceGenerator.apiBaseUrl = url

    val res = try {
      webService.isCellWall()
    } catch (err: Throwable) {
      ServiceGenerator.apiBaseUrl = lastUrl
      throw ServerUrlValidator.ValidationException(Reason.PATH_DOES_NOT_EXIST)
    }

    dataStore.updateData { settings ->
      settings.toBuilder()
        .setServerAddress(url.toString())
        .build()
    }
    return url
  }

  suspend fun register(info: CellInfo) {

  }
}
