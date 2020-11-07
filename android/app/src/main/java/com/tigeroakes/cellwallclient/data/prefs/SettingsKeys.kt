package com.tigeroakes.cellwallclient.data.prefs

import android.content.Context
import androidx.datastore.preferences.createDataStore
import androidx.datastore.preferences.preferencesKey

object SettingsKeys {

  val SERIAL = preferencesKey<String>("serial")
  val SERVER_ADDRESS = preferencesKey<String>("server_address")

  fun createDataStore(context: Context) = context.createDataStore(name = "settings")
}
