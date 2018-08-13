package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.CellState
import com.tigeroakes.cellwallclient.socket.SocketListLiveData
import org.json.JSONObject

class MainViewModel : ViewModel() {
    val stateRawData = SocketListLiveData()
    val state = Transformations.map(stateRawData) {
        CellState.from(it[0] as String, it[1] as JSONObject)
    }
}
