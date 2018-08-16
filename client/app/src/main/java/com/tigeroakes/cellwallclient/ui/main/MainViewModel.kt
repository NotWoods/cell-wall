package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.CellState
import com.tigeroakes.cellwallclient.socket.BoundSocket
import com.tigeroakes.cellwallclient.socket.SocketLiveData
import org.json.JSONObject

class MainViewModel : ViewModel() {
    private var stateRawData: SocketLiveData? = null
    private var state: LiveData<CellState>? = null

    fun getState(socket: BoundSocket) = state ?: Transformations.map(getRawState(socket)) { args ->
        CellState.from(args[0] as String, args[1] as JSONObject)
    }.also { state = it }

    private fun getRawState(socket: BoundSocket)
            = stateRawData ?: SocketLiveData("cell-update", socket).also { stateRawData = it }
}
