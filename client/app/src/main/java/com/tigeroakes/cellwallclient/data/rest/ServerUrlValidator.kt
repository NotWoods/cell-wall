package com.tigeroakes.cellwallclient.data.rest

import android.webkit.URLUtil
import androidx.annotation.StringRes
import androidx.annotation.VisibleForTesting
import com.tigeroakes.cellwallclient.R
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.IOException
import java.net.URI

enum class Reason(@StringRes val stringRes: Int) {
    BLANK(R.string.error_field_required),
    BAD_FORMAT(R.string.error_invalid_address),
    PATH_DOES_NOT_EXIST(R.string.error_incorrect_address),
    PATH_RETURNED_ERROR(R.string.error_connection_failed)
}

class ServerUrlValidator(private val httpClient: OkHttpClient) {
    companion object {
        private const val PING_PATH = "./is-cellwall-server"
    }

    class ValidationException(val reason: Reason) : Exception()

    @VisibleForTesting
    fun guessUri(serverUrl: String?): URI {
        if (serverUrl.isNullOrBlank()) {
            throw ValidationException(Reason.BLANK)
        }

        return if (URLUtil.isNetworkUrl(serverUrl)) {
            URI(serverUrl)
        } else {
            throw ValidationException(Reason.BAD_FORMAT)
        }
    }

    suspend fun validate(serverUrl: String?): URI {
        val url = guessUri(serverUrl)
        val request = Request.Builder().url(url.resolve(PING_PATH).toURL()).build()

        val response = try {
            httpClient.newCall(request).awaitResponse()
        } catch (err: IOException) {
            throw ValidationException(Reason.PATH_DOES_NOT_EXIST)
        }

        if (response.isSuccessful) {
            return url
        } else {
            throw ValidationException(Reason.PATH_RETURNED_ERROR)
        }
    }

}
