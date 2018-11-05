package com.tigeroakes.cellwallclient.data

import android.content.SharedPreferences
import androidx.core.content.edit

const val SERVER_ADDRESS_KEY = "address"
const val INSTALLATION_ID_KEY = "install_id"

/**
 * Provides typed getters and setters for SharedPreference values.
 * Setters are async by default.
 */
class PreferenceManager(private val prefs: SharedPreferences) {
    var serverAddress: String?
        get() = prefs.getString(SERVER_ADDRESS_KEY, null)
        set(value) = prefs.edit {
            putString(SERVER_ADDRESS_KEY, value)
        }

    var installationId: String?
        get() = prefs.getString(INSTALLATION_ID_KEY, null)
        set(value) = prefs.edit {
            putString(INSTALLATION_ID_KEY, value)
        }
}