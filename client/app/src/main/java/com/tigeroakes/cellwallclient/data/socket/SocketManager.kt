package com.tigeroakes.cellwallclient.data.socket

import com.tigeroakes.cellwallclient.model.CellState
import java.net.URI

class SocketManager(val address: URI) {
    private val socket: Socket = SocketIo(address)

    private val wrappers = ListenerWrappers<CellState>()

    /**
     * Listen for changes to CellState
     */
    fun requestStateUpdates(listener: (CellState) -> Unit) {
        socket.connectIfFirst()
        val wrapper = wrappers.makeWrapper(listener)
        socket.on(STATE_UPDATE_EVENT, wrapper)
    }

    /**
     * Stop listening for changes to CellState
     */
    fun removeUpdates(listener: (CellState) -> Unit) {
        wrappers.deleteWrapper(listener)?.let {
            socket.off(STATE_UPDATE_EVENT, it)
        }
        socket.disconnectIfLast()
    }

    fun removeUpdates() {
        for (listener in wrappers) {
            removeUpdates(listener)
        }
    }

    private fun Socket.connectIfFirst() {
        if (wrappers.isEmpty()) {
            this.connect()
        }
    }

    private fun Socket.disconnectIfLast() {
        if (wrappers.isEmpty()) {
            this.disconnect()
        }
    }

    companion object {
        private const val STATE_UPDATE_EVENT = "cell-update"
    }
}

/**
 * Used to make functions that cast from Any to T,
 * and keep track of them.
 */
private class ListenerWrappers<T> : Iterable<(T) -> Unit> {
    private val wrappers = mutableMapOf<(T) -> Unit, (Any) -> Unit>()

    fun isEmpty() = wrappers.isEmpty()

    @Suppress("UNCHECKED_CAST")
    fun makeWrapper(listener: (T) -> Unit): (Any) -> Unit {
        val wrapper: (Any) -> Unit = {
            listener(it as T)
        }
        wrappers[listener] = wrapper
        return wrapper
    }

    fun deleteWrapper(listener: (T) -> Unit): ((Any) -> Unit)? {
        return wrappers[listener]?.also {
            wrappers.remove(listener)
        }
    }

    override fun iterator() = wrappers.keys.iterator()
}