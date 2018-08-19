package com.tigeroakes.cellwallclient.ui.login

import android.net.Uri
import android.text.TextUtils
import android.webkit.URLUtil
import androidx.annotation.StringRes
import androidx.core.net.toUri
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.R
import okhttp3.*
import java.io.IOException

class LoginViewModel : ViewModel() {
    private val errorTextResource = MutableLiveData<@StringRes Int>()

    fun getErrorTextResource(): LiveData<Int> = errorTextResource

    fun attemptLogin(address: String, onSuccess: (address: Uri) -> Unit) {
        parseAddress(address)?.let { pingAddress(it, onSuccess) }
    }

    private fun parseAddress(address: String): Uri? {
        // Reset errors.
        errorTextResource.value = null

        // Check for a valid address
        if (TextUtils.isEmpty(address)) {
            errorTextResource.value = R.string.error_field_required
            return null
        }

        val addressUrl = address.toUri()

        // TODO: validate using normal URI methods
        if (!URLUtil.isValidUrl(address)) {
            errorTextResource.value = R.string.error_invalid_address
            return null
        }

        return addressUrl
    }

    /**
     * Tests to ensure that an address points to a CellWall server by making a HTTP request.
     * @param address Address to check
     * @param getString Function uses to get string corresponding to resource ID
     * @param onSuccess Callback called if the server responds OK
     */
    private fun pingAddress(address: Uri, onSuccess: (address: Uri) -> Unit) {
        val testUrl = address.buildUpon().appendPath("is-cellwall-server").build()
        val request = Request.Builder().url(testUrl.toString()).build()

        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, err: IOException) {
                errorTextResource.postValue(R.string.error_incorrect_address)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    onSuccess(address)
                } else {
                    errorTextResource.postValue(R.string.error_connection_failed)
                }
            }
        })
    }
}
