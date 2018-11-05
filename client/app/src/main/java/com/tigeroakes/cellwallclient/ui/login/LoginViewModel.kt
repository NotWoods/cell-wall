package com.tigeroakes.cellwallclient.ui.login

import android.app.Application
import android.preference.PreferenceManager.getDefaultSharedPreferences
import androidx.lifecycle.*
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.device.getCellInfo
import com.tigeroakes.cellwallclient.model.CellInfo
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.model.Resource
import java.net.URI

interface LoginViewModel {
    val isLoading: LiveData<Boolean>
    val errorText: LiveData<Event<String?>>
    val savedAddress: LiveData<Event<URI>>

    val cellInfo: LiveData<CellInfo>

    fun attemptLogin(address: String)
}

class LoginViewModelImpl(application: Application) : LoginViewModel, AndroidViewModel(application) {
    private val addressInput = MutableLiveData<String>()
    private val loginAttempt = Transformations.switchMap(addressInput) { url ->
        CellWallRepository.attemptToConnect(url, application::getString)
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
                val url = res.data!!
                value = Event(url)
            }
        }
    }

    override val cellInfo = MutableLiveData<CellInfo>().apply {
        value = getCellInfo(application.resources, getDefaultSharedPreferences(application))
    }

    override fun attemptLogin(address: String) {
        addressInput.value = address
    }
}
