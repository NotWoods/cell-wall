package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import androidx.core.net.toUri

object ServerUris {
    private const val PING_PATH = "is-cellwall-server"
    private const val CELL_SOCKET_NAMESPACE = "cell"

    /**
     * Returns path to use for pinging the server and checking that a URI is valid.
     */
    fun withPingPath(serverUrl: Uri): Uri =
            serverUrl.buildUpon().appendPath(PING_PATH).build()

    /**
     * Appends "/cell" to the given URL
     * @returns String representing entire URL
     */
    fun withSocketNamespace(serverUrl: Uri): Uri =
            serverUrl.buildUpon().appendPath(CELL_SOCKET_NAMESPACE).build()

    fun addImageHost(imageSrc: String?, serverUrl: Uri): Uri? {
        if (imageSrc == null) return null

        val path = imageSrc.removePrefix("/")
        val startsWithSlash = path != imageSrc
        return if (startsWithSlash) {
            serverUrl.buildUpon().appendPath(path).build()
        } else {
            path.toUri()
        }
    }
}