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

    private fun clearError() {
        error.value = ""
    }

    private fun setErrorText(value: String) {
        error.value = value
    }

    fun attemptLogin(address: String, mainHandler: Handler,
                     getString: (resId: Int) -> String, onSuccess: (address: Uri) -> Unit) {
        parseAddress(address, getString)?.let {
            pingAddress(it, mainHandler, getString, onSuccess)
        }
    }

    private fun parseAddress(address: String, getString: (resId: Int) -> String): Uri? {
        // Reset errors.
        clearError()

        // Check for a valid address
        if (TextUtils.isEmpty(address)) {
            setErrorText(getString(R.string.error_field_required))
            return null
        }

        val addressUrl = address.toUri()

        // TODO: validate using normal URI methods
        if (!URLUtil.isValidUrl(address)) {
            setErrorText(getString(R.string.error_invalid_address))
            return null
        }

        return addressUrl
    }

    /**
     * Tests to ensure that an address points to a CellWall server by making a HTTP request.
     * @param address Address to check
     * @param mainHandler Handler used to post messages back to the main thread from background
     * @param getString Function uses to get string corresponding to resource ID
     * @param onSuccess Callback called if the server responds OK
     */
    private fun pingAddress(address: Uri, mainHandler: Handler,
                    getString: (resId: Int) -> String, onSuccess: (address: Uri) -> Unit) {
        val testUrl = address.buildUpon().appendPath("is-cellwall-server").build()
        val request = Request.Builder().url(testUrl.toString()).build()
        OkHttpClient().newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, error: IOException) {
                mainHandler.post {
                    setErrorText(getString(R.string.error_incorrect_address))
                }
            }

            override fun onResponse(call: Call, response: Response) {
                if (response.isSuccessful) {
                    mainHandler.post {
                        onSuccess(address)
                    }
                } else {
                    mainHandler.post {
                        setErrorText(getString(R.string.error_connection_failed))
                    }
                }
            }
        })
    }
}
