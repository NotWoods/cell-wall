package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel

class MainViewModel : ViewModel() {
    private var mode: ModeLiveData? = null

    fun getMode(address: String): LiveData<CellMode> = mode ?: address.let {
        ModeLiveData(it).also { mode = it }
    }
}
