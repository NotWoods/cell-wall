package com.tigeroakes.cellwallclient

import android.annotation.SuppressLint
import android.content.Context
import android.net.Uri
import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.util.AttributeSet
import android.view.View
import android.view.WindowManager
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.net.toUri
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.fragment.app.transaction
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.socket.BoundSocket
import com.tigeroakes.cellwallclient.ui.ReconnectButton.Companion.Status
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.main.MainFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment
import com.tigeroakes.cellwallclient.util.getSystemDimension
import kotlinx.android.synthetic.main.main_activity.*


class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<Status> {
    private lateinit var viewModel: MainViewModel
    private var socket: BoundSocket? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.main_activity)

        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        reconnect_button.apply {
            setOnClickListener { socket?.connectSocket() }
            setOnLongClickListener {
                openLogin(true)
                true
            }
        }
        goFullscreen()

        if (savedInstanceState == null) {
            val serverAddress = getDefaultSharedPreferences(this)
                    .getString(SERVER_ADDRESS_KEY, null)
                    ?.toUri()

            // If there is no server address, show the login page
            if (serverAddress == null) {
                openLogin()
            } else {
                onServerVerified(serverAddress)
            }
        }
    }

    @SuppressLint("InlinedApi")
    private fun goFullscreen() {
        container.systemUiVisibility =
                View.SYSTEM_UI_FLAG_LOW_PROFILE or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION

        if (SDK_INT >= VERSION_CODES.KITKAT) {
            window.setFlags(
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            )

            val navBarHeight = resources.getSystemDimension("navigation_bar_height")
            reconnect_button.updateLayoutParams<ConstraintLayout.LayoutParams> {
                bottomMargin = navBarHeight
            }
            reconnect_button.requestLayout()
        }
    }

    private fun openLogin(asChild: Boolean = false) {
        setFragment(LoginFragment.newInstance(asChild))
    }

    /**
     * Called once the user successfully logs in to the server.
     * Switches to the Main fragment then starts the socket to listen for new data sent from the
     * server.
     * TODO: Handle changing the address and building a new socket
     */
    override fun onServerVerified(serverAddress: Uri) {
        setFragment(MainFragment.newInstance())

        val newSocket = SocketFactory.build(getDefaultSharedPreferences(this), serverAddress)

        lifecycle.addObserver(newSocket)

        newSocket.getStatus().observe(this, this)
        viewModel.getState(newSocket).observe(this, Observer {
            setFragment(when (it) {
                is CellState.Text -> LargeTextFragment.newInstance(it.text)
                is CellState.Image -> ImageFragment.newInstance(it.src)
                is CellState.Button -> ButtonFragment.newInstance(it.backgroundColor)
                else -> MainFragment.newInstance()
            })
        })

        socket = newSocket
    }

    /**
     * Called when the display mode changes. The UI reacts by displaying a different fragment
     * depending on the mode.
     */
    override fun onChanged(state: Status) {
        reconnect_button.setStatus(state)
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.transaction {
            replace(R.id.container, fragmentToOpen)
            setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
        }
    }
}
