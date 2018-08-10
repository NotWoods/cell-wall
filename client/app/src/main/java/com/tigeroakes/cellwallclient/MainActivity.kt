package com.tigeroakes.cellwallclient

import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.main.CellMode
import com.tigeroakes.cellwallclient.ui.main.MainFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment

class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<CellMode> {
    private lateinit var viewModel: MainViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        if (savedInstanceState == null) {
            val serverAddress = getDefaultSharedPreferences(this)
                    .getString(SERVER_ADDRESS_KEY, null)

            // If there is no server address, show the login page
            if (TextUtils.isEmpty(serverAddress)) {
                setFragment(LoginFragment.newInstance())
            } else {
                onServerVerified(serverAddress!!)
            }
        }
    }

    /**
     * Called once the user successfully logs in to the server.
     */
    override fun onServerVerified(serverAddress: String) {
        setFragment(MainFragment.newInstance())

        viewModel
                .getMode(Installation.id(getDefaultSharedPreferences(this)), serverAddress)
                .observe(this, this)
    }

    /**
     * Called when the display mode changes. The UI reacts by displaying a different fragment
     * depending on the mode.
     */
    override fun onChanged(mode: CellMode) {
        when (mode) {
            CellMode.BLANK -> MainFragment.newInstance()
            CellMode.TEXT -> LargeTextFragment.newInstance()
            else -> MainFragment.newInstance()
        }.let { setFragment(it) }
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.beginTransaction()
                .replace(R.id.container, fragmentToOpen)
                .commitNow()
    }
}
