package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.rest.Data

class MainViewModel : ViewModel() {
    private var mode: ModeLiveData? = null

    fun getMode(id: String, address: String): LiveData<Data.State> {
        return mode ?: ModeLiveData(id, address).also { mode = it }
    }
}
