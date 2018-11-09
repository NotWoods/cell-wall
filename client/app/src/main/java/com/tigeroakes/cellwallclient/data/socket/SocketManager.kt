package com.tigeroakes.cellwallclient.data.socket

import com.tigeroakes.cellwallclient.model.CellState
import io.socket.client.Socket.*
import org.json.JSONObject
import java.net.URI

class SocketManager(val address: URI) {
    private val socket: Socket = SocketIo(address)

    private val wrappers = ListenerWrappers {
        CellState.from(it as JSONObject)
    }

    init {
        socket.on(EVENT_CONNECT) {
            System.out.println(it)
        }
        socket.on(EVENT_MESSAGE) {
            System.out.println(it)
        }
        socket.on(EVENT_CONNECT_ERROR) { err ->
            System.out.println(err)
        }
        socket.on(EVENT_RECONNECT) {
            System.out.println(it)
        }
        socket.on(EVENT_CONNECT_TIMEOUT) {
            System.out.println(it)
        }
    }

    val connected
        get() = socket.connected

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
