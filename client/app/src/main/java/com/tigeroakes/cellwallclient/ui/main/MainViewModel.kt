package com.tigeroakes.cellwallclient.ui.main

import android.net.Uri
import android.util.Log
import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.CellState
import com.tigeroakes.cellwallclient.socket.SocketListener
import com.tigeroakes.cellwallclient.socket.SocketService
import com.tigeroakes.cellwallclient.socket.SocketServiceLifecycleObserver
import com.tigeroakes.cellwallclient.ui.ReconnectButton.Companion.Status

class MainViewModel(id: String) : ViewModel(), SocketListener {
    val socketLifecycleObserver = SocketServiceLifecycleObserver(id)
    private var cellState = MutableLiveData<CellState>()
    private val socketStatus = MutableLiveData<Status>()

    init {
        cellState.value = CellState.Blank()
        socketStatus.value = Status.DISCONNECTED
    }

    fun getCellState(): LiveData<CellState> = cellState
    fun getSocketStatus(): LiveData<Status> = socketStatus
    val onReconnectClick = View.OnClickListener {
        if (socketStatus.value == Status.DISCONNECTED) {
            socketLifecycleObserver.connectWhenInForeground()
        }
    }

    fun setAddress(address: Uri) {
        socketLifecycleObserver.setAddress(address)
    }

    override fun onConnect() {
        Log.d("SOCKET", "Connected")
        socketStatus.postValue(Status.CONNECTED)
    }

    override fun onConnecting() {
        Log.d("SOCKET", "Connecting")
        socketStatus.postValue(Status.CONNECTING)
    }

    override fun onDisconnect() {
        Log.d("SOCKET", "Disconnected")
        socketStatus.postValue(Status.DISCONNECTED)
    }

    override fun onConnectError(error: Throwable) {
        Log.d("SOCKET", "Connection error")
        socketStatus.postValue(Status.DISCONNECTED)
    }

    override fun onCellUpdate(state: CellState) {
        cellState.postValue(state)
    }
}
