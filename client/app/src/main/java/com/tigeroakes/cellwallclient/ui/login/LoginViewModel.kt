package com.tigeroakes.cellwallclient.ui.login

import android.net.Uri
import androidx.annotation.StringRes
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.socket.ServerUrlValidator

class LoginViewModel : ViewModel() {
    companion object {
        val reasonToStringRes = mapOf(
                ServerUrlValidator.Reason.BLANK to R.string.error_field_required,
                ServerUrlValidator.Reason.BAD_FORMAT to R.string.error_invalid_address,
                ServerUrlValidator.Reason.PATH_DOES_NOT_EXIST to R.string.error_incorrect_address,
                ServerUrlValidator.Reason.PATH_RETURNED_ERROR to R.string.error_connection_failed
        )
    }

    private val errorTextResource = MutableLiveData<@StringRes Int>()

    fun getErrorTextResource(): LiveData<Int> = errorTextResource

    fun attemptLogin(address: String, onSuccess: (address: Uri) -> Unit) {
        // Reset errors.
        errorTextResource.value = null

        ServerUrlValidator.validate(address,
                onSuccess = onSuccess,
                onFailure = { errorTextResource.postValue(reasonToStringRes[it]) })
    }
}
