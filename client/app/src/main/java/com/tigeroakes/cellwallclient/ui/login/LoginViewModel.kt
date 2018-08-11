package com.tigeroakes.cellwallclient.ui.login

import android.text.TextUtils
import android.webkit.URLUtil
import androidx.annotation.StringRes
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel;
import com.tigeroakes.cellwallclient.R
import java.io.IOException

class LoginViewModel : ViewModel() {
    private val error: MutableLiveData<String> by lazy {
        MutableLiveData<String>().also { it.value = "" }
    }

    fun getErrorText(): LiveData<String> = error

    fun clearError() {
        error.value = ""
    }

    fun setErrorText(value: String) {
        error.value = value
    }

    fun validateAddress(address: String, getString: (resId: Int) -> String): Boolean {
        // Reset errors.
        clearError()

        // Check for a valid address
        if (TextUtils.isEmpty(address)) {
            setErrorText(getString(R.string.error_field_required))
            return false
        } else if (!URLUtil.isValidUrl(address)) {
            setErrorText(getString(R.string.error_invalid_address))
            return false
        }

        return true
    }
}
