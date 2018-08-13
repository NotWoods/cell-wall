package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent
import io.socket.client.IO
import io.socket.emitter.Emitter
import java.net.URI

class BoundSocket(uri: Uri, options: IO.Options) : LifecycleObserver {
    private val socket = IO.socket(uri.toString(), options)

    @OnLifecycleEvent(Lifecycle.Event.ON_RESUME)
    fun connectSocket() {
        socket.connect()
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
}