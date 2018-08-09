package com.tigeroakes.cellwallclient

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences

const val SERVER_ADDRESS_KEY = "address"

class StartActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_start)
        if (savedInstanceState == null) {
            val serverAddress = getDefaultSharedPreferences(this)
                    .getString(SERVER_ADDRESS_KEY, null)
            // If there is no server address, show the login page
            val startFragment: Fragment =
                    if (serverAddress != null) StartFragment.newInstance() else LoginFragment.newInstance()

            supportFragmentManager.beginTransaction()
                    .replace(R.id.container, startFragment)
                    .commitNow()
        }
    }

}
