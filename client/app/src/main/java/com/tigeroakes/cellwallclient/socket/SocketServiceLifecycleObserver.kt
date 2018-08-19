package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent

class SocketServiceLifecycleObserver(private val id: String) : LifecycleObserver {
    private var address: Uri? = null

    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun connectWhenInForeground() {
        address?.let {
            SocketService.connect(it, id)
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun disconnectWhenInBackground() {
        SocketService.disconnect()
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun removeListenersWhenInBackground() {
        SocketService.setListener(null)
    }

    fun setAddress(address: Uri) {
        this.address = address
        connectWhenInForeground()
    }
}