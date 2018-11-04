package com.tigeroakes.cellwallclient.device

import android.content.SharedPreferences
import androidx.annotation.VisibleForTesting
import com.tigeroakes.cellwallclient.data.PreferenceManager
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
        val prefs = PreferenceManager(sharedPrefs)
        return sID ?: prefs.installationId ?: newId(prefs)
    }

    private fun newId(prefs: PreferenceManager) = randomUUID().toString().also { id ->
        prefs.installationId = id
        sID = id
    }

    @VisibleForTesting
    fun resetId() {
        sID = null
    }
}