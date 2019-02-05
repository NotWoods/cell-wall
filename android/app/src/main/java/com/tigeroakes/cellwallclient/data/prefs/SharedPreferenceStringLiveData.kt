package com.tigeroakes.cellwallclient.data.prefs

import android.content.SharedPreferences

class SharedPreferenceStringLiveData(
        sharedPrefs: SharedPreferences,
        key: String
): SharedPreferenceLiveData<String?>(sharedPrefs, key, null) {
    override fun getValue(key: String, default: String?): String? =
            sharedPrefs.getString(key, default)
}

fun SharedPreferences.getStringLiveData(key: String) =
        SharedPreferenceStringLiveData(this, key)
