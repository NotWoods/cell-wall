package com.tigeroakes.cellwallclient.ui.login

import androidx.annotation.StringRes
import androidx.lifecycle.*
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.data.rest.ServerUrlValidator
import com.tigeroakes.cellwallclient.model.CellInfo
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.model.Resource
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import java.net.URI
import java.util.*

interface LoginViewModel {
    val isLoading: LiveData<Boolean>
    val errorResource: LiveData<Event<Int?>>
    val savedAddress: LiveData<Event<String>>

    val uuid: UUID

    fun attemptLogin(address: String, cellInfo: CellInfo)
}

class LoginViewModelImpl(
        private val repository: CellWallRepository
) : ViewModel(), LoginViewModel {
    private val viewModelJob = Job()
    private val uiScope = CoroutineScope(Dispatchers.Main + viewModelJob)

    // Destroy viewModelJob and any running tasks when the ViewModel is killed
    override fun onCleared() {
        super.onCleared()
        viewModelJob.cancel()
    }

    private val loginAttempt = MutableLiveData<Resource<URI>>()

    override val isLoading: LiveData<Boolean> = Transformations.map(loginAttempt) {
        it.status == Resource.Status.LOADING
    }
    override val errorResource = MutableLiveData<Event<@StringRes Int?>>()
    override val savedAddress = MediatorLiveData<Event<String>>().apply {
        // Default to a handled event with a blank URI.
        value = Event(repository.serverAddress.value?.toString() ?: "").apply {
            getContentIfNotHandled()
        }

        addSource(loginAttempt) { res ->
            // Only update when successful.
            if (res.status === Resource.Status.SUCCESS) {
                val url = res.data!!
                value = Event(url.toString())
            }
        }
    }

    override val uuid
        get() = repository.id

    /**
     * Try logging in to the server by pinging it and ensuring it responds.
     */
    override fun attemptLogin(address: String, cellInfo: CellInfo) {
        loginAttempt.value = Resource.loading(null)
        uiScope.launch {
            val url = try {
                repository.attemptToConnect(address)
            } catch (err: ServerUrlValidator.ValidationException) {
                loginAttempt.value = Resource.error(err.reason.name, null)
                errorResource.value = Event(err.reason.stringRes)
                return@launch
            }
            loginAttempt.value = Resource.loading(url)

            repository.register(cellInfo)
            loginAttempt.value = Resource.success(url)
        }
    }
}
