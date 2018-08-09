package com.tigeroakes.cellwallclient.viewmodels

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class LoginViewModel : ViewModel() {
    private val error = MutableLiveData<String>()
    private val progress = MutableLiveData<Number>()

    init {
        error.value = ""
        progress.value = 0
    }

    fun getErrorText(): LiveData<String> = error

    fun getProgress(): LiveData<Number> = progress

    fun clearError() {
        error.value = ""
    }

    fun setErrorText(value: String) {
        error.value = value
    }
}