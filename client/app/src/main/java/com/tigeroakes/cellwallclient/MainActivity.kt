package com.tigeroakes.cellwallclient

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.View
import android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.net.toUri
import androidx.fragment.app.Fragment
import androidx.fragment.app.transaction
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.device.Installation
import com.tigeroakes.cellwallclient.socket.SocketService
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginFragment
import com.tigeroakes.cellwallclient.ui.blank.BlankFragment
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.main.MainViewModelFactory
import com.tigeroakes.cellwallclient.ui.main.MainViewModelImpl
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment
import com.tigeroakes.cellwallclient.device.getSystemDimension
import kotlinx.android.synthetic.main.main_activity.*


class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener {
    private lateinit var viewModel: MainViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        val sharedPrefs = getDefaultSharedPreferences(this)
        val id = Installation.id(sharedPrefs)

        viewModel = ViewModelProviders.of(this, MainViewModelFactory(id)).get(MainViewModelImpl::class.java)
        viewModel.socketStatus.observe(this, Observer {
            reconnect_button.setStatus(it)
        })
        viewModel.cellState.observe(this, Observer {
            setFragment(cellStateToFragment(it))
        })
        viewModel.showingLogin.observe(this, Observer {
            reconnect_button.showIf(it != true)
        })
        lifecycle.addObserver(viewModel.socketLifecycleObserver)
        SocketService.setListener(viewModel)

        reconnect_button.run {
            setOnClickListener(viewModel.onReconnectClick)
            setOnLongClickListener {
                openLogin(true)
                true
            }
        }
        goFullscreen()

        val serverAddress = sharedPrefs
                .getString(SERVER_ADDRESS_KEY, null)
                ?.toUri()

        // If there is no server address, show the login page
        if (serverAddress == null) {
            openLogin()
        } else {
            onServerVerified(serverAddress)
        }
    }

    /**
     * Called once the user successfully logs in to the server.
     * Switches to the Main fragment then starts the socket to listen for new data sent from the
     * server.
     */
    override fun onServerVerified(serverAddress: Uri) {
        setFragment(BlankFragment.newInstance())
        viewModel.setAddress(serverAddress)
        viewModel.setShowingLogin(false)
    }

    /**
     * Hides the status bar and navigation bar, additionally padding the reconnect button so it
     * appears above the hidden action bar area.
     */
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
            window.setFlags(FLAG_LAYOUT_NO_LIMITS, FLAG_LAYOUT_NO_LIMITS)

            val navBarHeight = resources.getSystemDimension("navigation_bar_height")
            reconnect_button.updateLayoutParams<ConstraintLayout.LayoutParams> {
                bottomMargin = navBarHeight
            }
            reconnect_button.requestLayout()
        }
    }

    private fun openLogin(asChild: Boolean = false) {
        viewModel.setShowingLogin(true)
        supportFragmentManager.transaction {
            replace(R.id.container, LoginFragment.newInstance(asChild))
            if (asChild) addToBackStack(null)
            setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
        }
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.transaction {
            replace(R.id.container, fragmentToOpen)
            setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
        }
    }

    companion object {
        private fun cellStateToFragment(state: CellState) = when (state) {
            is CellState.Text -> LargeTextFragment.newInstance(state.text)
            is CellState.Image -> ImageFragment.newInstance(state.src)
            is CellState.Button -> ButtonFragment.newInstance(state.backgroundColor)
            else -> BlankFragment.newInstance()
        }
    }
}
