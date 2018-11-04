package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.ui.ReconnectButton.Companion.Status

interface MainViewModel {
    val cellState: LiveData<Event<CellState>>
    val socketStatus: LiveData<Status>
}

class MainViewModelImpl : ViewModel(), MainViewModel {
    override val cellState = MutableLiveData<Event<CellState>>().apply {
        value = Event(CellState.Blank)
    }
    override val socketStatus = MutableLiveData<Status>().apply {
        value = Status.DISCONNECTED
    }
}
