package com.tigeroakes.cellwallclient.data.socket

import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.data.socket.SocketManager
import com.tigeroakes.cellwallclient.model.CellState
import java.net.URI

class StateLiveData : LiveData<CellState>() {
    private var socketManager: SocketManager? = null

    private val listener = { state: CellState ->
        postValue(state)
    }

    fun setAddress(address: URI) {
        socketManager?.removeUpdates()
        socketManager = SocketManager(address)
    }

    override fun onActive() {
        socketManager?.requestStateUpdates(listener)
    }

    override fun onInactive() {
        socketManager?.removeUpdates(listener)
    }
}