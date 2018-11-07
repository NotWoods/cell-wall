package com.tigeroakes.cellwallclient.ui.login

import android.content.res.Resources
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import com.tigeroakes.cellwallclient.data.CellWallRepository

class LoginViewModelFactory(
        private val repository: CellWallRepository,
        private val resources: Resources
) : ViewModelProvider.NewInstanceFactory() {
    @Suppress("UNCHECKED_CAST")
    override fun <T : ViewModel> create(modelClass: Class<T>) =
            LoginViewModelImpl(repository, resources) as T
}
