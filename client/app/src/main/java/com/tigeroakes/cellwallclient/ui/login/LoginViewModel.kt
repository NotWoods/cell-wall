package com.tigeroakes.cellwallclient.ui.login

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel;

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
}
