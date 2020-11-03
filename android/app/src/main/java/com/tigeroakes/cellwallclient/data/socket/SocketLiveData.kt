package com.tigeroakes.cellwallclient.data.socket

import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.model.CellState
import io.socket.client.IO
import io.socket.client.Socket
import java.net.URI

open class SocketLiveData<T>(
  address: URI,
  options: IO.Options? = null,
  private val event: String
) : LiveData<T>() {

  private val socket: Socket = IO.socket(address, options)

  @Suppress("Unchecked_Cast")
  override fun onActive() {
    socket.connect()
    socket.on(event) { firstArg ->
      postValue(firstArg as T)
    }
  }

  override fun onInactive() {
    socket.disconnect()
  }
}

class CellStateSocketLiveData(
  address: URI,
  options: IO.Options? = null
) : SocketLiveData<CellState>(address, options, event = "cell-update")
