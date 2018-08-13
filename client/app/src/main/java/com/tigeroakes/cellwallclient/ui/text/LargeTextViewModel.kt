package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class LargeTextViewModel : ViewModel() {
    private val text: MutableLiveData<String> by lazy {
        MutableLiveData<String>()
    }

    fun getText(): LiveData<String> = text

    fun setText(value: String) {
        text.value = value
    }
}
