package com.tigeroakes.cellwallclient.data.socket

interface Socket {
    val connected: Boolean

    fun connect()

    fun disconnect()

    fun emit(event: String, arg: Any)

    fun on(event: String, listener: (Any) -> Unit)

    fun off(event: String, listener: (Any) -> Unit)
}