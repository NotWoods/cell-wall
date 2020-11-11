package com.tigeroakes.cellwallclient.data.rest

import android.net.Uri
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

  fun guessUri(serverUrl: String?): Uri {
    if (serverUrl.isNullOrBlank()) {
      throw ValidationException(Reason.BLANK)
    }

    var url = serverUrl
    return if (URLUtil.isNetworkUrl(url)) {
      if (!url.endsWith("/")) url += "/"
      Uri.parse(url)
    } else {
      val withScheme = "http://$url"
      Uri.parse(url)
    }
  }
}
