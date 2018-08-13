package com.tigeroakes.cellwallclient

import android.net.Uri
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import androidx.appcompat.app.AppCompatActivity
import androidx.core.net.toUri
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.socket.BoundSocket
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.main.MainFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment
import io.socket.client.IO
import kotlinx.android.synthetic.main.main_activity.*

class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<CellState> {
    private lateinit var viewModel: MainViewModel
    private var socket: BoundSocket? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)
        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        if (savedInstanceState == null) {
            val serverAddress = getDefaultSharedPreferences(this)
                    .getString(SERVER_ADDRESS_KEY, null)
                    ?.toUri()

            // If there is no server address, show the login page
            if (serverAddress == null) {
                setFragment(LoginFragment.newInstance())
            } else {
                onServerVerified(serverAddress)
            }
        }
    }

    /**
     * Called once the user successfully logs in to the server.
     * Switches to the Main fragment then starts the socket to listen for new data sent from the
     * server.
     */
    override fun onServerVerified(serverAddress: Uri) {
        setFragment(MainFragment.newInstance())

        viewModel.state.observe(this, this)
        socket = SocketFactory
                .build(getDefaultSharedPreferences(this), serverAddress)
                .apply { on("cell-update", viewModel.stateRawData) }
                .also { container.setOnTouchListener(TouchEmitter(it)) }
    }

    /**
     * Called when the display mode changes. The UI reacts by displaying a different fragment
     * depending on the mode.
     */
    override fun onChanged(state: CellState) {
        setFragment(when (state) {
            is CellState.Text -> LargeTextFragment.newInstance(state.text)
            is CellState.Image -> ImageFragment.newInstance(state.src)
            is CellState.Button -> ButtonFragment.newInstance(state.backgroundColor)
            else -> MainFragment.newInstance()
        })
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.beginTransaction()
                .replace(R.id.container, fragmentToOpen)
                .commit()
    }
}
