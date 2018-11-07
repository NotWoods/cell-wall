package com.tigeroakes.cellwallclient.ui.main

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.tigeroakes.cellwallclient.data.CellWallRepository

class MainViewModelFactory(
        private val repository: CellWallRepository
) : ViewModelProvider.NewInstanceFactory() {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>) = MainViewModelImpl(repository) as T
}
