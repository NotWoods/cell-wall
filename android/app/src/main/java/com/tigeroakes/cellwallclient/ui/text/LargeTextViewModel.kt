package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

interface LargeTextViewModel {
    val text: LiveData<String>

    fun setText(value: String)
}

class LargeTextViewModelImpl : LargeTextViewModel, ViewModel() {
    override val text = MutableLiveData<String>()

    override fun setText(value: String) {
        text.value = value
    }
}
