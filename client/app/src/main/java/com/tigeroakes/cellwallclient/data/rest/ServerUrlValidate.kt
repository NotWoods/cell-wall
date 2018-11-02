package com.tigeroakes.cellwallclient.data.rest

import android.webkit.URLUtil
import androidx.annotation.StringRes
import com.tigeroakes.cellwallclient.R
import java.net.URI

enum class Reason(@StringRes val stringRes: Int) {
    BLANK(R.string.error_field_required),
    BAD_FORMAT(R.string.error_invalid_address),
    PATH_DOES_NOT_EXIST(R.string.error_incorrect_address),
    PATH_RETURNED_ERROR(R.string.error_connection_failed)
}

class ServerUrlValidationException(val reason: Reason) : Exception()

fun guessUri(serverUrl: String?): URI {
    if (serverUrl.isNullOrBlank()) {
        throw ServerUrlValidationException(Reason.BLANK)
    }

    return URLUtil.guessUrl(serverUrl).let {
        if (URLUtil.isNetworkUrl(it)) {
            URI(it)
        } else {
            throw ServerUrlValidationException(Reason.BAD_FORMAT)
        }
    }
}
