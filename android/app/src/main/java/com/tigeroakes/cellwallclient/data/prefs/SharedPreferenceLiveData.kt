package com.tigeroakes.cellwallclient.data.prefs

import android.content.SharedPreferences
import android.content.SharedPreferences.OnSharedPreferenceChangeListener
import androidx.lifecycle.LiveData

abstract class SharedPreferenceLiveData<T>(
        protected val sharedPrefs: SharedPreferences,
        private val key: String,
        private val default: T
): LiveData<T>() {
    abstract fun getValue(key: String, default: T): T

    private val preferenceChangeListener = OnSharedPreferenceChangeListener { _, key ->
        if (key == this.key) {
            value = getValue(key, default)
        }
    }

    override fun onActive() {
        super.onActive()
        value = getValue(key, default)
        sharedPrefs.registerOnSharedPreferenceChangeListener(preferenceChangeListener)
    }

    override fun onInactive() {
        sharedPrefs.unregisterOnSharedPreferenceChangeListener(preferenceChangeListener)
        super.onInactive()
    }
}
