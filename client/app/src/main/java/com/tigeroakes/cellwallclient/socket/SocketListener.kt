package com.tigeroakes.cellwallclient.socket

import androidx.annotation.WorkerThread
import com.tigeroakes.cellwallclient.model.CellState

interface SocketListener {
    @WorkerThread
    fun onConnect()

    @WorkerThread
    fun onConnecting()

    @WorkerThread
    fun onDisconnect()

    @WorkerThread
    fun onConnectError(error: Throwable)

    @WorkerThread
    fun onCellUpdate(state: CellState)
}