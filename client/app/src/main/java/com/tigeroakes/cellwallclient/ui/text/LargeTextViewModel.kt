package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.rest.CellWallServerService
import com.tigeroakes.cellwallclient.rest.Data
import com.tigeroakes.cellwallclient.rest.RetrofitLiveData

class LargeTextViewModel : ViewModel() {
    private val text: MutableLiveData<String> by lazy {
        MutableLiveData<String>()
    }

    fun getText(): LiveData<String> = text

    fun setText(value: String) {
        text.value = value
    }
}
