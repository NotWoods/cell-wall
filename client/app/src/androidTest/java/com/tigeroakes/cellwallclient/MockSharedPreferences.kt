package com.tigeroakes.cellwallclient


import android.content.SharedPreferences


/**
 * Mock implementation of shared preference, which just saves data in memory using map.
 * https://gist.github.com/amardeshbd/354173d00b988574ee5019c4ba0c8a0b
 */
class MockSharedPreference : SharedPreferences {
    private val preferenceMap = mutableMapOf<String, Any>()
    private val preferenceEditor = MockSharedPreferenceEditor(preferenceMap)

    override fun getAll(): Map<String, *> = preferenceMap

    override fun getString(s: String, s1: String?): String? {
        return preferenceMap[s] as String? ?: s1
    }

    @Suppress("UNCHECKED_CAST")
    override fun getStringSet(s: String, set: Set<String>?): Set<String>? {
        return preferenceMap[s] as Set<String>? ?: set
    }

    override fun getInt(s: String, i: Int): Int {
        return preferenceMap[s] as Int
    }

    override fun getLong(s: String, l: Long): Long {
        return preferenceMap[s] as Long
    }

    override fun getFloat(s: String, v: Float): Float {
        return preferenceMap[s] as Float
    }

    override fun getBoolean(s: String, b: Boolean): Boolean {
        return preferenceMap[s] as Boolean
    }

    override fun contains(s: String): Boolean {
        return preferenceMap.containsKey(s)
    }

    override fun edit(): SharedPreferences.Editor {
        return preferenceEditor
    }

    override fun registerOnSharedPreferenceChangeListener(
            onSharedPreferenceChangeListener: SharedPreferences.OnSharedPreferenceChangeListener
    ) {

    }

    override fun unregisterOnSharedPreferenceChangeListener(
            onSharedPreferenceChangeListener: SharedPreferences.OnSharedPreferenceChangeListener
    ) {

    }

    class MockSharedPreferenceEditor(private val preferenceMap: MutableMap<String, Any>) : SharedPreferences.Editor {
        private fun put(key: String, value: Any): SharedPreferences.Editor {
            preferenceMap[key] = value
            return this
        }
        override fun putString(s: String, s1: String) = put(s, s1)
        override fun putStringSet(s: String, set: Set<String>) = put(s, set)
        override fun putInt(s: String, i: Int) = put(s, i)
        override fun putLong(s: String, l: Long) = put(s, l)
        override fun putFloat(s: String, v: Float) = put(s, v)
        override fun putBoolean(s: String, b: Boolean) = put(s, b)

        override fun remove(s: String): SharedPreferences.Editor {
            preferenceMap.remove(s)
            return this
        }

        override fun clear(): SharedPreferences.Editor {
            preferenceMap.clear()
            return this
        }

        override fun commit() = true

        override fun apply() {
            // Nothing to do, everything is saved in memory.
        }
    }

}
