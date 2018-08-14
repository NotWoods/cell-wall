package com.tigeroakes.cellwallclient.ui.main

import android.annotation.SuppressLint
import android.os.Handler
import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.CellState
import com.tigeroakes.cellwallclient.socket.SocketLiveData
import org.json.JSONObject

class MainViewModel : ViewModel() {
    val stateRawData = SocketLiveData()
    val state: LiveData<CellState> = Transformations.map(stateRawData) {
        CellState.from(it[0] as String, it[1] as JSONObject)
    }
}
