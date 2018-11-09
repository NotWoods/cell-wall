package com.tigeroakes.cellwallclient.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.tigeroakes.cellwallclient.data.CellWallRepository

class RepositoryViewModelFactory(
        private val repository: CellWallRepository
) : ViewModelProvider.NewInstanceFactory() {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>) =
            modelClass.getConstructor(CellWallRepository::class.java).newInstance(repository) as T
}
