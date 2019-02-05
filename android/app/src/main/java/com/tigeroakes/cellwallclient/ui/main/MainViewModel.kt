package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.ui.main.ReconnectButton.Companion.Status

interface MainViewModel {
    val isUrlSaved: Boolean
    val cellState: LiveData<Event<CellState>>
    val socketStatus: LiveData<Status>
}

class MainViewModelImpl(private val repository: CellWallRepository) : ViewModel(), MainViewModel {
    override val isUrlSaved
        get() = repository.isUrlSaved

    override val cellState: LiveData<Event<CellState>> =
            Transformations.map(repository.getState()) { Event(it) }
    override val socketStatus = MutableLiveData<Status>().apply {
        value = Status.DISCONNECTED
    }
}
