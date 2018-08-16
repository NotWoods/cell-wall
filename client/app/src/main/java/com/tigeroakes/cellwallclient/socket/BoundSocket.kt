package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import android.os.Handler
import android.os.Looper
import android.util.Log
import androidx.lifecycle.*
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONObject
import java.net.URI

class BoundSocket(uri: Uri, options: IO.Options) : LifecycleObserver {
    private val mainHandler = Handler(Looper.getMainLooper())
    private val socket = IO.socket(uri.toString(), options)
    private val status = MutableLiveData<Status>()

    init {
        status.value = Status.DISCONNECTED

        val onConnect = Emitter.Listener {
            mainHandler.post { status.value = Status.CONNECTED }
        }
        val onDisconnect = Emitter.Listener {
            mainHandler.post { status.value = Status.DISCONNECTED }
        }

        socket.on(Socket.EVENT_CONNECT, onConnect)
                .on(Socket.EVENT_DISCONNECT, onDisconnect)
                .on(Socket.EVENT_CONNECT_ERROR, onDisconnect)
    }

    fun getStatus(): LiveData<Status> = status

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun connectSocket() {
        if (status.value != Status.CONNECTED) {
            status.value = Status.CONNECTING
            socket.connect()
        }
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_PAUSE)
    fun disconnectSocket() {
        socket.disconnect()
    }

    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun removeListeners() {
        socket.off()
    }

    fun on(event: String, fn: Emitter.Listener): BoundSocket {
        socket.on(event, fn)
        return this
    }

    fun emit(event: String, vararg args: Any?): BoundSocket {
        socket.emit(event, args)
        return this
    }

    fun off(event: String, fn: Emitter.Listener): BoundSocket {
        socket.off(event, fn)
        return this
    }

    companion object {
        enum class Status {
            DISCONNECTED,
            CONNECTING,
            CONNECTED
        }
    }
}