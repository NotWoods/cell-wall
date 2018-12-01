package com.tigeroakes.cellwallclient.device

import android.content.SharedPreferences
import androidx.annotation.VisibleForTesting
import androidx.core.content.edit
import java.util.*
import java.util.UUID.randomUUID

/**
 * Holds installation-specific data.
 */
object Installation {
    @VisibleForTesting
    const val INSTALLATION_ID_KEY = "install_id"

    private var sID: UUID? = null

    /**
     * Returns an identifier that is unique to this installation of the app.
     * @param prefs Preferences where the ID will be stored
     */
    fun id(prefs: SharedPreferences): UUID {
        return sID
                ?: prefs.getString(INSTALLATION_ID_KEY, null)?.toUUID().also { sID = it }
                ?: newId(prefs)
    }

    @VisibleForTesting
    fun resetId() {
        sID = null
    }

    private fun newId(prefs: SharedPreferences) = randomUUID().also { id ->
        prefs.edit {
            putString(INSTALLATION_ID_KEY, id.toString())
        }
        sID = id
    }

    private fun String.toUUID() = UUID.fromString(this)
}