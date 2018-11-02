package com.tigeroakes.cellwallclient.data.socket

import io.socket.client.IO
import java.net.URI

class SocketIo(address: URI) : Socket {
    private val socketInternal = IO.socket(address)

    override val connected: Boolean
            get() = socketInternal.connected()

    override fun connect() {
        socketInternal.connect()
    }

    override fun disconnect() {
        socketInternal.disconnect()
    }

    override fun emit(event: String, arg: Any) {
        socketInternal.emit(event, arg)
    }

    override fun on(event: String, listener: (Any) -> Unit) {
        socketInternal.on(event, listener)
    }

    override fun off(event: String, listener: (Any) -> Unit) {
        socketInternal.off(event, listener)
    }
}