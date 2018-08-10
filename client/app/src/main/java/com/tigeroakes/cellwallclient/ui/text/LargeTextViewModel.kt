package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.LiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.rest.CellWallServerService
import com.tigeroakes.cellwallclient.rest.Data
import com.tigeroakes.cellwallclient.rest.RetrofitLiveData

class LargeTextViewModel : ViewModel() {
    private var text: RetrofitLiveData<Data.Text>? = null

    fun getText(id: String, service: CellWallServerService): LiveData<Data.Text> {
        return text ?: RetrofitLiveData(service.getTextData(id)).also { text = it }
    }

    override fun onCleared() {
        super.onCleared()
        text?.cancel()
    }
}
