package com.tigeroakes.cellwallclient.data.socket

typealias Listener = (Array<Any>) -> Unit

interface Socket {
    val connected: Boolean

    fun connect()

    fun disconnect()

    fun emit(event: String, arg: Array<Any>)

    fun on(event: String, listener: Listener)

    fun off(event: String, listener: Listener)
}