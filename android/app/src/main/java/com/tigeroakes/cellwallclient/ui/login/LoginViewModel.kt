package com.tigeroakes.cellwallclient.ui.login

import android.app.Application
import android.net.Uri
import androidx.annotation.StringRes
import androidx.lifecycle.*
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.data.rest.ServerUrlValidator
import com.tigeroakes.cellwallclient.device.CellInfo
import com.tigeroakes.cellwallclient.model.Event
import com.tigeroakes.cellwallclient.model.Resource
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class LoginViewModel(
  application: Application
) : AndroidViewModel(application) {

  private val repository = CellWallRepository.get(application)

  private val loginAttempt = MutableLiveData<Resource<Uri>>(Resource.Loading())
  private val _errorResource = MutableLiveData<Event<@StringRes Int?>>()

  val isLoading: LiveData<Boolean> = Transformations.map(loginAttempt) {
    it is Resource.Loading
  }
  val errorResource: LiveData<Event<Int?>> = _errorResource

  val serverAddressSetting = repository.serverAddress
  val serialSetting = repository.serial

  /**
   * Try logging in to the server by pinging it and ensuring it responds.
   */
  suspend fun attemptLogin(
    address: String,
    serial: String,
    cellInfo: CellInfo
  ) = viewModelScope.launch {
    loginAttempt.value = Resource.Loading()
    val url = try {
      repository.attemptToConnect(address)
    } catch (err: ServerUrlValidator.ValidationException) {
      loginAttempt.value = Resource.Error(err.reason.name)
      _errorResource.value = Event(err.reason.stringRes)
      return@launch
    }
    loginAttempt.value = Resource.Loading(url)

    repository.register(serial, cellInfo)
    loginAttempt.value = Resource.Success(url)
  }.join()
}
