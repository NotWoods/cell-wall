package com.tigeroakes.cellwallclient.ui.login

import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.model.Resource
import java.net.URI

class LoginViewModel : ViewModel() {
  private val loginAttempt = MutableLiveData<Resource<URI>>(Resource.Loading())
}
