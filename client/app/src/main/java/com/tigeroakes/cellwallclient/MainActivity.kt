package com.tigeroakes.cellwallclient

import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.rest.Data
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.main.CellMode
import com.tigeroakes.cellwallclient.ui.main.MainFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment

class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<Data.State> {
    private lateinit var viewModel: MainViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        if (savedInstanceState == null) {
            val serverAddress: String? = getDefaultSharedPreferences(this)
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
     * Switches to the Main fragment then starts the socket to listen for new data sent from the
     * server.
     */
    override fun onServerVerified(serverAddress: String) {
        setFragment(MainFragment.newInstance())

        val id = Installation.id(getDefaultSharedPreferences(this))

        viewModel
                .getMode(id, serverAddress)
                .observe(this, this)
    }

    /**
     * Called when the display mode changes. The UI reacts by displaying a different fragment
     * depending on the mode.
     */
    override fun onChanged(state: Data.State?) {
        when (state?.mode) {
            CellMode.TEXT -> LargeTextFragment.newInstance((state.data as Data.Text).text)
            CellMode.IMAGE -> ImageFragment.newInstance((state.data as Data.Image).src)
            CellMode.BUTTON -> ButtonFragment.newInstance((state.data as Data.Button).backgroundColor)
            else -> MainFragment.newInstance()
        }.let { setFragment(it) }
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.beginTransaction()
                .replace(R.id.container, fragmentToOpen)
                .commitNow()
    }
}
