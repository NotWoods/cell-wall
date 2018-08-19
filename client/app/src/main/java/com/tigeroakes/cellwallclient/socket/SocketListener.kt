package com.tigeroakes.cellwallclient.socket

import com.tigeroakes.cellwallclient.CellState

interface SocketListener {
    fun onConnect()

    fun onConnecting()

    fun onDisconnect()

    fun onConnectError(error: Throwable)

    fun onCellUpdate(state: CellState)
}