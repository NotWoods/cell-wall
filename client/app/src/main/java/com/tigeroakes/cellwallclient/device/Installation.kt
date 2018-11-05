package com.tigeroakes.cellwallclient.device

import android.content.SharedPreferences
import androidx.annotation.VisibleForTesting
import com.tigeroakes.cellwallclient.data.PreferenceManager
import java.util.*
import java.util.UUID.randomUUID

/**
 * Holds installation-specific data.
 */
object Installation {
    private var sID: UUID? = null

    /**
     * Returns an identifier that is unique to this installation of the app.
     * @param sharedPrefs Preferences where the ID will be stored
     */
    fun id(sharedPrefs: SharedPreferences): UUID {
        val prefs = PreferenceManager(sharedPrefs)
        return sID ?: prefs.installationId?.toUUID().also { sID = it } ?: newId(prefs)
    }

    @VisibleForTesting
    fun resetId() {
        sID = null
    }

    private fun newId(prefs: PreferenceManager) = randomUUID().also { id ->
        prefs.installationId = id.toString()
        sID = id
    }

    private fun String.toUUID() = UUID.fromString(this)
}