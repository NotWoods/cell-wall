package com.tigeroakes.cellwallclient

import android.animation.LayoutTransition
import android.annotation.SuppressLint
import android.content.res.ColorStateList
import android.graphics.drawable.Drawable
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.util.TypedValue
import android.view.View
import android.view.WindowManager
import androidx.annotation.ColorInt
import androidx.appcompat.app.AppCompatActivity
import androidx.coordinatorlayout.widget.CoordinatorLayout
import androidx.core.content.ContextCompat
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
import kotlinx.android.synthetic.main.main_activity.*


class MainActivity : AppCompatActivity(), LoginFragment.OnServerVerifiedListener, Observer<BoundSocket.Companion.Status> {
    private lateinit var viewModel: MainViewModel
    private var socket: BoundSocket? = null

    @SuppressLint("InlinedApi")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.main_activity)

        viewModel = ViewModelProviders.of(this).get(MainViewModel::class.java)

        val resourceId = resources
                .getIdentifier("navigation_bar_height", "dimen", "android")

        if (resourceId > 0) {
            val navBarHeight = resources.getDimensionPixelSize(resourceId)

            val lp = fab_container.layoutParams as CoordinatorLayout.LayoutParams
            fab_container.layoutParams = lp.apply {
                bottomMargin = navBarHeight
            }
            fab_container.requestLayout()
        }

        fab_container.layoutTransition.enableTransitionType(LayoutTransition.CHANGING)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            window.setFlags(
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                    WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
            )
        }

        container.systemUiVisibility =
                View.SYSTEM_UI_FLAG_LOW_PROFILE or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION

        action_reconnect.setOnClickListener {
            socket?.connectSocket()
        }
        action_reconnect.setOnLongClickListener {
            setFragment(LoginFragment.newInstance())
            true
        }

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
    override fun onChanged(state: BoundSocket.Companion.Status) {
        val resource: Int
        @ColorInt val tint: Int
        val showProgress: Boolean
        when (state) {
            BoundSocket.Companion.Status.CONNECTED -> {
                resource = R.drawable.ic_connected
                tint = R.color.colorPrimary
                showProgress = false
            }
            BoundSocket.Companion.Status.CONNECTING -> {
                resource = R.drawable.ic_connecting
                tint = R.color.colorAccent
                showProgress = true
            }
            else -> {
                val typedValue = TypedValue()
                theme.resolveAttribute(R.attr.colorError, typedValue, true)

                resource = R.drawable.ic_disconnected
                tint = typedValue.data
                showProgress = false
            }
        }
        val drawable = ContextCompat.getDrawable(this, resource)
        action_reconnect.apply {
            setImageDrawable(drawable)
            supportBackgroundTintList = ColorStateList.valueOf(tint)
        }
        fab_reconnecting.visibility = if (showProgress) View.VISIBLE else View.INVISIBLE
    }

    private fun setFragment(fragmentToOpen: Fragment) {
        supportFragmentManager.beginTransaction()
                .replace(R.id.container, fragmentToOpen)
                .setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
                .commit()
    }
}
