package com.tigeroakes.cellwallclient

import android.content.SharedPreferences
import android.view.MotionEvent
import androidx.core.content.edit
import io.socket.client.IO
import io.socket.client.Socket
import org.json.JSONObject

object SocketManager {
    const val ADDRESS_KEY = "address"

    private var socket: Socket? = null

    /**
     * Creates a socket that connects to the given address, then saves it for future use.
     */
    private fun buildSocket(address: String): Socket {
        val socket = IO.socket(address)
        this.socket = socket
        return socket
    }

    /**
     * Creates a socket that connects to the address saved in preferences.
     * Returns null if no address is saved in preferences.
     */
    private fun buildSocketFromPrefs(sharedPrefs: SharedPreferences): Socket? {
        val address = sharedPrefs.getString(ADDRESS_KEY, null)
        return address?.let { buildSocket(it) }
    }

    /**
     * Creates a socket that connects to the given address. The address is saved
     * so that future runs of the program can re-use it.
     */
    fun createSocket(address: String, sharedPrefs: SharedPreferences): Socket {
        sharedPrefs.edit {
            putString(ADDRESS_KEY, address)
        }
        return buildSocket(address)
    }

    /**
     * Gets an instance of the socket. If no instance was created, builds the socket from the
     * saved address. If there was no address saved, returns null.
     */
    fun getSocket(sharedPrefs: SharedPreferences) = socket ?: buildSocketFromPrefs(sharedPrefs)

    fun Socket.emitTouch(event: MotionEvent) {
        val touchObj = JSONObject()
        touchObj.put("x", event.rawX)
        touchObj.put("y", event.rawY)
        touchObj.put("action", event.action)
        this.emit("touch", touchObj)
    }
}