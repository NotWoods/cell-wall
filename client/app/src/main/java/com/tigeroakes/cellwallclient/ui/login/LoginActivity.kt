package com.tigeroakes.cellwallclient.ui.login

import android.animation.Animator
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.View
import android.view.ViewPropertyAnimator
import android.view.inputmethod.EditorInfo
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.data.CellWallRepositoryImpl
import com.tigeroakes.cellwallclient.data.PreferenceManager
import kotlinx.android.synthetic.main.login_activity.*

/**
 * A login screen that offers login via email/password.
 */
class LoginActivity : AppCompatActivity() {
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_activity)

        val factory = LoginViewModelFactory(
                CellWallRepositoryImpl.getInstance(getDefaultSharedPreferences(this)),
                resources
        )
        viewModel = ViewModelProviders.of(this, factory).get(LoginViewModelImpl::class.java)

        // Login when the enter is pressed
        address.setOnEditorActionListener(TextView.OnEditorActionListener { _, id, _ ->
            if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                attemptLogin()
                return@OnEditorActionListener true
            }
            false
        })

        // Login when the connect button is pressed
        connect_button.setOnClickListener { attemptLogin() }

        val prefs = PreferenceManager(getDefaultSharedPreferences(this))
        address.setText(prefs.serverAddress) // Auto-fill with pre-existing serverAddress

        viewModel.isLoading.observe(this, Observer {
            // Show the loading bar when communicating with the server.
            showProgress(it)
        })
        viewModel.errorText.observe(this, Observer {
            // Show error, if any.
            address_container.error = it.peekContent()

            // When error updates and is not-null, focus on the address input.
            it.getContentIfNotHandled()?.let {
                address.requestFocus()
            }
        })
        viewModel.savedAddress.observe(this, Observer { urlEvent ->
            urlEvent.getContentIfNotHandled()?.let { url ->
                // When saved URL updates, update preferences and exit this activity.
                prefs.serverAddress = url.toString()
                finish()
            }
        })

        debug_uuid.text = getString(R.string.debug_uuid, viewModel.uuid)
        viewModel.cellInfo.observe(this, Observer { info ->
            // Update the debug text
            debug_device_name.text = getString(R.string.debug_device_name, info.deviceName)
            debug_density.text = getString(R.string.debug_density, info.density)
            debug_display.text = getString(R.string.debug_display, info.widthPixels, info.heightPixels)
        })
    }

    /**
     * Attempts to connect to the server specified by the login form.
     */
    private fun attemptLogin() {
        viewModel.attemptLogin(address.text.toString())
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    private fun showProgress(show: Boolean) {
        val animDelay = 200L
        val shortAnimTime = resources.getInteger(android.R.integer.config_shortAnimTime).toLong()

        login_form.visibility = if (show) View.GONE else View.VISIBLE
        login_form.animate()
                .setStartDelay(animDelay)
                .setDuration(shortAnimTime)
                .alpha(if (show) 0f else 1f)
                .setListener {
                    login_form.visibility = if (show) View.GONE else View.VISIBLE
                }

        login_progress.visibility = if (show) View.VISIBLE else View.GONE
        login_progress.animate()
                .setStartDelay(animDelay)
                .setDuration(shortAnimTime)
                .alpha(if (show) 1f else 0f)
                .setListener {
                    login_progress.visibility = if (show) View.VISIBLE else View.GONE
                }
    }

    /**
     * Add a listener to this ViewPropertyAnimator using the provided actions.
     * Based on Android KTX Animator.addListener function.
     */
    private inline fun ViewPropertyAnimator.setListener(
            crossinline onEnd: (animator: Animator) -> Unit = {},
            crossinline onStart: (animator: Animator) -> Unit = {},
            crossinline onCancel: (animator: Animator) -> Unit = {},
            crossinline onRepeat: (animator: Animator) -> Unit = {}
    ): ViewPropertyAnimator {
        val listener = object : Animator.AnimatorListener {
            override fun onAnimationRepeat(animator: Animator) = onRepeat(animator)
            override fun onAnimationEnd(animator: Animator) = onEnd(animator)
            override fun onAnimationCancel(animator: Animator) = onCancel(animator)
            override fun onAnimationStart(animator: Animator) = onStart(animator)
        }
        return setListener(listener)
    }
}
