package com.tigeroakes.cellwallclient.ui.login

import android.app.Application
import androidx.lifecycle.*
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.model.Resource
import java.net.URI

interface LoginViewModel {
    val isLoading: LiveData<Boolean>
    val errorText: LiveData<Event<String?>>
    val savedAddress: LiveData<Event<URI>>

    fun attemptLogin(address: String)
}

class LoginViewModelImpl(application: Application) : LoginViewModel, AndroidViewModel(application) {
    private val addressInput = MutableLiveData<String>()
    private val loginAttempt = Transformations.switchMap(addressInput) { url ->
        CellWallRepository.attemptLogin(url, application::getString)
    }

    override val isLoading: LiveData<Boolean> = Transformations.map(loginAttempt) {
        it.status == Resource.Status.LOADING
    }
    override val errorText: LiveData<Event<String?>> = Transformations.map(loginAttempt) {
        Event(it.message)
    }
    override val savedAddress = MediatorLiveData<Event<URI>>().apply {
        // Default to a handled event with a blank URI.
        val blankEvent = Event(URI("")).apply { getContentIfNotHandled() }
        value = blankEvent

        addSource(loginAttempt) { res ->
            // Only update when successful.
            if (res.status === Resource.Status.SUCCESS) {
                value = Event(res.data!!)
            }
        }
    }

    override fun attemptLogin(address: String) {
        addressInput.value = address
    }
}
