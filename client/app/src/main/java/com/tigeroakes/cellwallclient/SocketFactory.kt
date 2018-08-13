package com.tigeroakes.cellwallclient

import android.content.SharedPreferences
import android.content.res.Resources
import android.net.Uri
import androidx.core.net.toUri
import com.tigeroakes.cellwallclient.socket.BoundSocket
import io.socket.client.IO

object SocketFactory {
    fun build(sharedPrefs: SharedPreferences, address: Uri? = null): BoundSocket {
        val serverAddress = address
                ?: sharedPrefs.getString(SERVER_ADDRESS_KEY, null)!!.toUri()
        val socketAddress = serverAddress.buildUpon().appendPath("cell").build()
        return BoundSocket(socketAddress, getOptions(sharedPrefs))
    }

    private fun getOptions(sharedPrefs: SharedPreferences) = IO.Options().apply {
        val display = Resources.getSystem().displayMetrics
        val id = Installation.id(sharedPrefs)
        query = "id=$id&width=${display.widthPixels}&height=${display.heightPixels}"
    }
}