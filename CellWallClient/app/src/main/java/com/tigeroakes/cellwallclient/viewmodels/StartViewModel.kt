package com.tigeroakes.cellwallclient.viewmodels

import android.content.SharedPreferences
import androidx.core.content.edit
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

const val SERVER_ADDRESS_KEY = "address"

class StartViewModel : ViewModel() {
    private var serverAddress: MutableLiveData<String>? = null

    fun getServerAddress(sharedPrefs: SharedPreferences): LiveData<String> =
        serverAddress ?: loadServerAddress(sharedPrefs)


    fun setServerAddress(value: String, sharedPrefs: SharedPreferences) {
        sharedPrefs.edit {
            putString(SERVER_ADDRESS_KEY, value)
            serverAddress?.value = value
        }
    }

    private fun loadServerAddress(sharedPrefs: SharedPreferences): LiveData<String> {
        val serverAddress = MutableLiveData<String>()
        serverAddress.value = sharedPrefs.getString(SERVER_ADDRESS_KEY, null)

        this.serverAddress = serverAddress
        return serverAddress
    }
}
