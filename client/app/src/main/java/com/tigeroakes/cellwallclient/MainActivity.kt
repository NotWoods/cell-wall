package com.tigeroakes.cellwallclient

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.os.PersistableBundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.Menu
import android.view.MenuItem
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.core.net.toUri
import androidx.fragment.app.Fragment
import androidx.lifecycle.LiveData
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.socket.BoundSocket
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.main.MainFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment
import kotlinx.android.synthetic.main.main_activity.*

class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<CellState> {
    private val hideHandler = Handler()
    @SuppressLint("InlinedApi")
    private val hidePart2Runnable = Runnable {
        viewModel.hideSystemUi()
    }
    private val showPart2Runnable = Runnable {
        // Delayed display of UI elements
        viewModel.showAppBar()
    }
    private val hideRunnable = Runnable { hide() }
    private lateinit var viewModel: MainViewModel
    private lateinit var action_reconnect: MenuItem
    private var socket: BoundSocket? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.main_activity)
        setSupportActionBar(toolbar)

        container.setOnClickListener { hide() }

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

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.menu_main, menu)
        action_reconnect = menu.findItem(R.id.action_reconnect)
        return true
    }

    override fun onPrepareOptionsMenu(menu: Menu?): Boolean {
        super.onPrepareOptionsMenu(menu)
        action_reconnect.setIcon(when (socket?.getStatus()?.value) {
            BoundSocket.Companion.Status.CONNECTED -> R.drawable.ic_connected
            BoundSocket.Companion.Status.CONNECTING -> R.drawable.ic_connecting
            else -> R.drawable.ic_disconnected
        })

        return true
    }

    override fun onPostCreate(savedInstanceState: Bundle?, persistentState: PersistableBundle?) {
        super.onPostCreate(savedInstanceState, persistentState)

        // Trigger the initial hide() shortly after the activity has been
        // created, to briefly hint to the user that UI controls
        // are available.
        delayedHide(100)
    }

    override fun onOptionsItemSelected(item: MenuItem) = when (item.itemId) {
        R.id.action_login -> {
            setFragment(LoginFragment.newInstance())
            true
        }
        R.id.action_reconnect -> {
            socket?.connectSocket()
            true
        }
        else -> super.onOptionsItemSelected(item)
    }

    /**
     * Called once the user successfully logs in to the server.
     * Switches to the Main fragment then starts the socket to listen for new data sent from the
     * server.
     */
    override fun onServerVerified(serverAddress: Uri) {
        setFragment(MainFragment.newInstance())

        viewModel.state.observe(this, this)
        viewModel.getSystemUiVisibility().observe(this, Observer {
            container.systemUiVisibility = it
        })
        viewModel.getAppBarVisible().observe(this, Observer {
            if (it == true) {
                supportActionBar?.show()
                fullscreen_content_controls.visibility = View.VISIBLE
            } else {
                supportActionBar?.hide()
                fullscreen_content_controls.visibility = View.GONE
            }
        })
        socket = SocketFactory
                .build(getDefaultSharedPreferences(this), serverAddress)
                .apply { on("cell-update", viewModel.stateRawData) }
                .also { socket ->
                    container.setOnTouchListener(TouchEmitter(socket))
                    socket.getStatus().also { data ->
                        data.observe(this, Observer { invalidateOptionsMenu() })
                    }
                }
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

    private fun hide() {
        // Hide UI first
        viewModel.hideAppBar()

        // Schedule a runnable to display UI elements after a delay
        hideHandler.removeCallbacks(showPart2Runnable)
        hideHandler.postDelayed(hidePart2Runnable, UI_ANIMATION_DELAY.toLong())
    }

    @SuppressLint("InlinedApi")
    private fun show() {
        viewModel.showSystemUi()

        // Schedule a runnable to display UI elements after a delay
        hideHandler.removeCallbacks(hidePart2Runnable)
        hideHandler.postDelayed(showPart2Runnable, UI_ANIMATION_DELAY.toLong())
    }

    /**
     * Schedules a call to hide() in [delayMillis], canceling any
     * previously scheduled calls.
     */
    private fun delayedHide(delayMillis: Int) {
        hideHandler.removeCallbacks(hideRunnable)
        hideHandler.postDelayed(hideRunnable, delayMillis.toLong())
    }

    companion object {
        /**
         * Some older devices needs a small delay between UI widget updates
         * and a change of the status and navigation bar.
         */
        private const val UI_ANIMATION_DELAY = 300
    }
}
