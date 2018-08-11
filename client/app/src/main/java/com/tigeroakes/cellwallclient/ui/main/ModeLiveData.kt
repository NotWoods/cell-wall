package com.tigeroakes.cellwallclient.ui.main

import android.content.res.Resources
import androidx.lifecycle.LiveData
import com.google.gson.Gson
import com.google.gson.GsonBuilder
import com.tigeroakes.cellwallclient.rest.Data
import io.socket.client.IO
import io.socket.client.Socket
import io.socket.emitter.Emitter
import org.json.JSONObject
import java.net.URI

class ModeLiveData(id: String, address: String) : LiveData<Data.State>(), Emitter.Listener {
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
        val mode = CellMode.valueOf(args[0] as String)
        val json = args[0] as JSONObject
        val data = json.run {
            when (mode) {
                CellMode.CONFIGURE -> Data.Configure(getString("backgroundColor"), getString("icon"))
                CellMode.TEXT -> Data.Text(getString("text"))
                CellMode.IMAGE -> Data.Image(getString("src"))
                CellMode.BUTTON -> Data.Button(getString("backgroundColor"))
                else -> Data.Blank()
            }
        }

        value = Data.State(mode, data)
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