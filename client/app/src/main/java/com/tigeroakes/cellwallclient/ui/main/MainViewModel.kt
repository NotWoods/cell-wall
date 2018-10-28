package com.tigeroakes.cellwallclient.ui.main

import android.net.Uri
import android.util.Log
import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.socket.SocketListener
import com.tigeroakes.cellwallclient.socket.SocketServiceLifecycleObserver
import com.tigeroakes.cellwallclient.ui.ReconnectButton.Companion.Status

interface MainViewModel : SocketListener {
    val socketLifecycleObserver: SocketServiceLifecycleObserver
    val cellState: LiveData<CellState>
    val socketStatus: LiveData<Status>
    val showingLogin: LiveData<Boolean>

    val onReconnectClick: View.OnClickListener

    fun setAddress(address: Uri)
    fun setShowingLogin(value: Boolean)
}

class MainViewModelImpl(id: String) : ViewModel(), MainViewModel {
    override val socketLifecycleObserver = SocketServiceLifecycleObserver(id)
    override val cellState = MutableLiveData<CellState>().apply { value = CellState.Blank }
    override val socketStatus = MutableLiveData<Status>().apply { value = Status.DISCONNECTED }
    override val showingLogin = MutableLiveData<Boolean>().apply { value = false }

    override val onReconnectClick = View.OnClickListener {
        if (socketStatus.value == Status.DISCONNECTED) {
            socketLifecycleObserver.connectWhenInForeground()
        }
    }

    override fun setAddress(address: Uri) {
        socketLifecycleObserver.setAddress(address)
    }

    override fun setShowingLogin(value: Boolean) {
        showingLogin.value = value
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
