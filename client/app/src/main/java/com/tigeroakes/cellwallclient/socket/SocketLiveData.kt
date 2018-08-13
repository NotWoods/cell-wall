package com.tigeroakes.cellwallclient.socket

import androidx.lifecycle.LiveData
import io.socket.emitter.Emitter

/**
 * LiveData class that can be used as a listener for a {@link Socket}.
 * When the server sends over data, the first value is set as the new live data
 * value.
 */
class SocketLiveData<T>(private val index: Int = 0) : LiveData<T>(), Emitter.Listener {
    override fun call(vararg args: Any?) {
        value = args[index] as T
    }
}

/**
 * LiveData class that can be used as a listener for a {@link Socket}.
 * When the server sends over data, the arguments are set as the new live data value.
 */
class SocketListLiveData : LiveData<Array<out Any?>>(), Emitter.Listener {
    override fun call(vararg args: Any?) {
        value = args
    }
}
