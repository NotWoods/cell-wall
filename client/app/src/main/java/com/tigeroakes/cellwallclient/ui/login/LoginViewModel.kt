package com.tigeroakes.cellwallclient.ui.login

import android.net.Uri
import android.os.Handler
import android.preference.PreferenceManager
import android.text.TextUtils
import android.webkit.URLUtil
import androidx.annotation.StringRes
import androidx.core.content.edit
import androidx.core.net.toUri
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel;
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import kotlinx.android.synthetic.main.login_fragment.*
import okhttp3.*
import java.io.IOException

class LoginViewModel : ViewModel() {
    private val error: MutableLiveData<String> by lazy {
        MutableLiveData<String>().also { it.value = "" }
    }

    fun getErrorText(): LiveData<String> = error

    fun attemptLogin(address: String, getString: (resId: Int) -> String,
                     onSuccess: (address: Uri) -> Unit) {
        parseAddress(address, getString)?.let {
            pingAddress(it, getString, onSuccess)
        }
    }

    private fun parseAddress(address: String, getString: (resId: Int) -> String): Uri? {
        // Reset errors.
        error.value = ""

        // Check for a valid address
        if (TextUtils.isEmpty(address)) {
            error.value = getString(R.string.error_field_required)
            return null
        }

        val addressUrl = address.toUri()

        // TODO: validate using normal URI methods
        if (!URLUtil.isValidUrl(address)) {
            error.value = getString(R.string.error_invalid_address)
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
    private fun pingAddress(address: Uri, getString: (resId: Int) -> String,
                            onSuccess: (address: Uri) -> Unit) {
        val testUrl = address.buildUpon().appendPath("is-cellwall-server").build()
        val request = Request.Builder().url(testUrl.toString()).build()

        val incorrectAddressMsg = getString(R.string.error_incorrect_address)
        val connectionFailedMsg = getString(R.string.error_connection_failed)

        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, err: IOException) {
                error.postValue(incorrectAddressMsg)
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    onSuccess(address)
                } else {
                    error.postValue(connectionFailedMsg)
                }
            }
        })
    }
}
