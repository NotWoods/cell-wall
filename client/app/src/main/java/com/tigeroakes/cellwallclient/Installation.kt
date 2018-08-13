package com.tigeroakes.cellwallclient

import android.content.SharedPreferences
import androidx.core.content.edit
import java.util.UUID.randomUUID

/**
 * Holds installation-specific data.
 */
object Installation {
    private var sID: String? = null

    /**
     * Returns an identifier that is unique to this installation of the app.
     * @param sharedPrefs Preferences where the ID will be stored
     */
    fun id(sharedPrefs: SharedPreferences): String {
        return sID ?: (
                    sharedPrefs.getString(INSTALLATION_ID_KEY, null) ?: newId(sharedPrefs)
                ).also { sID = it }
    }

    private fun newId(sharedPrefs: SharedPreferences): String {
        val id = randomUUID().toString()
        sharedPrefs.edit {
            putString(INSTALLATION_ID_KEY, id)
        }
        return id
    }
}