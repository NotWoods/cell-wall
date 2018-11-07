package com.tigeroakes.cellwallclient

import android.annotation.SuppressLint
import android.content.Intent
import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.View
import android.view.WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
import androidx.appcompat.app.AppCompatActivity
import androidx.constraintlayout.widget.ConstraintLayout
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.transaction
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.data.CellWallRepositoryImpl
import com.tigeroakes.cellwallclient.device.getSystemDimension
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.ui.blank.BlankFragment
import com.tigeroakes.cellwallclient.ui.button.ButtonFragment
import com.tigeroakes.cellwallclient.ui.image.ImageFragment
import com.tigeroakes.cellwallclient.ui.login.LoginActivity
import com.tigeroakes.cellwallclient.ui.main.MainViewModel
import com.tigeroakes.cellwallclient.ui.main.MainViewModelFactory
import com.tigeroakes.cellwallclient.ui.main.MainViewModelImpl
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragment
import kotlinx.android.synthetic.main.main_activity.*


/**
 * Switches between different fragments to represent the current Cell state.
 */
class MainActivity : AppCompatActivity() {
    private lateinit var viewModel: MainViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.main_activity)

        val factory = MainViewModelFactory(
                CellWallRepositoryImpl.getInstance(getDefaultSharedPreferences(this))
        )
        viewModel = ViewModelProviders.of(this, factory).get(MainViewModelImpl::class.java)

        // If there is no server address, show the login page
        if (!viewModel.isUrlSaved) {
            return openLogin()
        }

        reconnect_button.apply {
            setOnClickListener {}
            setOnLongClickListener {
                openLogin()
                true
            }
        }

        viewModel.socketStatus.observe(this, Observer {
            reconnect_button.setStatus(it)
        })
        viewModel.cellState.observe(this, Observer {
            it.getContentIfNotHandled()?.let { state ->
                supportFragmentManager.transaction {
                    replace(R.id.container, state.toFragment())
                    setCustomAnimations(R.animator.fade_in, R.animator.fade_out)
                }
            }
        })

        goFullscreen()
    }

    private fun openLogin() {
        val loginIntent = Intent(this, LoginActivity::class.java)
        startActivity(loginIntent)
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

    private fun CellState.toFragment() = cellStateToFragment(this)
    companion object {
        private fun cellStateToFragment(state: CellState) = when (state) {
            is CellState.Text -> LargeTextFragment.newInstance(state.text)
            is CellState.Image -> ImageFragment.newInstance(state.src)
            is CellState.Button -> ButtonFragment.newInstance(state.backgroundColor)
            else -> BlankFragment.newInstance()
        }
    }
}
