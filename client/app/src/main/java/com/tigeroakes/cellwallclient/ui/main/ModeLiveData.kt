package com.tigeroakes.cellwallclient.ui.main

import android.content.res.Resources
import androidx.lifecycle.LiveData
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import java.net.URI

class ModeLiveData(id: String, address: String) : LiveData<CellMode>(), Emitter.Listener {
    private var socket: Socket

    init {
        // Connect to the cell namespace of the socket
        val uri = URI(address).resolve("cell")
        // Include the display size in the connection
        val display = Resources.getSystem().displayMetrics
        val options = IO.Options()
        options.query = "width=${display.widthPixels}&height=${display.heightPixels}&id=$id"

        socket = IO.socket(uri, options)
        socket.on("cell-update", this)
    }

    /**
     * Called by the socket when this Cell should change the displayed content
     */
    override fun call(vararg args: Any?) {
        val mode = args[0] as String
        value = CellMode.valueOf(mode)
    }

    /**
     * Called when the parent Activity is created or resumed
     */
    override fun onActive() {
        super.onActive()
        socket.connect()
    }

    /**
     * Called when the parent Activity is paused or destroyed
     */
    override fun onInactive() {
        super.onInactive()
        socket.disconnect()
    }
}

enum class CellMode {
    BLANK,
    CONFIGURE,
    TEXT,
    IMAGE,
    BUTTON,
}