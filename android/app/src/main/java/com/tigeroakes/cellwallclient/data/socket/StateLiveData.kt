package com.tigeroakes.cellwallclient.data.socket

import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.model.CellState
import java.net.URI

class StateLiveData(address: URI) : LiveData<CellState>() {
    private var socketManager = SocketManager(address)

    private val listener = { state: CellState ->
        postValue(state)
    }

    override fun onActive() {
        socketManager.requestStateUpdates(listener)
    }

    override fun onInactive() {
        socketManager.removeUpdates(listener)
    }
}