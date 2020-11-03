package com.tigeroakes.cellwallclient.data

import android.content.Context
import androidx.lifecycle.*
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.tigeroakes.cellwallclient.data.prefs.SettingsSerializer
import com.tigeroakes.cellwallclient.data.rest.CellWallService
import com.tigeroakes.cellwallclient.data.rest.Reason
import com.tigeroakes.cellwallclient.data.rest.ServerUrlValidator
import com.tigeroakes.cellwallclient.data.rest.ServiceGenerator
import com.tigeroakes.cellwallclient.data.socket.SocketLiveData
import com.tigeroakes.cellwallclient.device.CellInfo
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.model.CellStates
import com.tigeroakes.cellwallclient.model.cellStateAdapter
import io.socket.client.IO
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.map
import kotlinx.coroutines.withContext
import java.net.URI

class CellWallRepository(context: Context) {

  private val moshi = Moshi.Builder()
    .add(cellStateAdapter)
    .add(KotlinJsonAdapterFactory())
    .build()

  private val serviceGenerator = ServiceGenerator(moshi)
  private val dataStore = SettingsSerializer.createDataStore(context)
  private val webService = serviceGenerator.createService(CellWallService::class.java)

  val serverAddress = dataStore.data.map { it.serverAddress }
  val isUrlSaved = serverAddress.map { it.isNotEmpty() }

  suspend fun attemptToConnect(address: String): URI {
    val lastUrl = serviceGenerator.apiBaseUrl

    val url = ServerUrlValidator.guessUri(address)
    serviceGenerator.apiBaseUrl = url

    val res = try {
      webService.isCellWall()
    } catch (err: Throwable) {
      serviceGenerator.apiBaseUrl = lastUrl
      throw ServerUrlValidator.ValidationException(Reason.PATH_DOES_NOT_EXIST)
    }

    dataStore.updateData { settings ->
      settings.toBuilder()
        .setServerAddress(url.toString())
        .build()
    }
    return url
  }

  suspend fun register(serial: String, info: CellInfo) {
    webService.putCell(serial, info)
  }

  fun getState(): LiveData<CellStates> = Transformations.switchMap(serverAddress.asLiveData()) { address ->
    if (address.isNotEmpty()) {
      val adapter = moshi.adapter(CellStates::class.java)
      SocketLiveData<String>(URI(address), event = "cell-update")
        .asFlow()
        .map {
          withContext(Dispatchers.IO) {
            adapter.fromJson(it)
          }
        }
        .asLiveData()
    } else {
      MutableLiveData(CellStates(listOf(CellState.Blank)))
    }
  }
}
