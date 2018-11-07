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

object ServerUrlValidator {
    class ValidationException(val reason: Reason) : Exception()

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
}
