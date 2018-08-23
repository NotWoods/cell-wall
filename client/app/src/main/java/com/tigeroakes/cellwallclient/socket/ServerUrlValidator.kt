package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import android.webkit.URLUtil.guessUrl
import android.webkit.URLUtil.isNetworkUrl
import androidx.annotation.AnyThread
import androidx.annotation.UiThread
import androidx.annotation.WorkerThread
import androidx.core.net.toUri
import com.tigeroakes.cellwallclient.socket.ServerUris.withPingPath
import okhttp3.*
import java.io.IOException

object ServerUrlValidator {
    enum class Reason {
        BLANK,
        BAD_FORMAT,
        PATH_DOES_NOT_EXIST,
        PATH_RETURNED_ERROR
    }

    private val client = OkHttpClient()

    /**
     * Tests to ensure that an address points to a CellWall server by making a HTTP request.
     * @param serverUrl Address to check. Will try to format the human entered URL.
     * @param onSuccess Called if the server responds OK. Passed the formatted URL.
     * @param onFailure Called if the URL was malformed or the server didn't respond.
     */
    fun validate(serverUrl: String?,
                 @WorkerThread onSuccess: (serverUri: Uri) -> Unit,
                 @WorkerThread @UiThread onFailure: (reason: Reason) -> Unit) {
        if (serverUrl == null || serverUrl.isEmpty()) return onFailure(Reason.BLANK)

        val guessedUrl = guessUrl(serverUrl)
        val serverUri = if (isNetworkUrl(guessedUrl)) {
            guessedUrl.toUri()
        } else {
            return onFailure(Reason.BAD_FORMAT)
        }

        val request = Request.Builder()
                .url(withPingPath(serverUri).toString())
                .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, err: IOException) {
                onFailure(Reason.PATH_DOES_NOT_EXIST)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    onSuccess(serverUri)
                } else {
                    onFailure(Reason.PATH_RETURNED_ERROR)
                }
            }
        })
    }
}