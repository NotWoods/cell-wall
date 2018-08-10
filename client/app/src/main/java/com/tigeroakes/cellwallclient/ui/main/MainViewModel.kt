package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel

class MainViewModel : ViewModel() {
    private var mode: ModeLiveData? = null

    fun getMode(id: String, address: String): LiveData<CellMode> {
        return mode ?: ModeLiveData(id, address).also { mode = it }
    }
}
