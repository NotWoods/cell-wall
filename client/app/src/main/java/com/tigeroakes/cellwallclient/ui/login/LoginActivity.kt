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
import com.tigeroakes.cellwallclient.device.getCellInfo
import com.tigeroakes.cellwallclient.ui.RepositoryViewModelFactory
import kotlinx.android.synthetic.main.login_activity.*

/**
 * A login screen that offers login via email/password.
 */
class LoginActivity : AppCompatActivity() {
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_activity)

        val factory = RepositoryViewModelFactory(
                CellWallRepositoryImpl.getInstance(getDefaultSharedPreferences(applicationContext))
        )
        viewModel = ViewModelProviders.of(this, factory).get(LoginViewModelImpl::class.java)

        setupAddressInput()

        setupLoadingBar()

        setupDebugText()
    }

    /**
     * Attempts to connect to the server specified by the login form.
     */
    private fun attemptLogin() {
        viewModel.attemptLogin(address.text.toString(), getCellInfo(resources.displayMetrics))
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

    private fun setupLoadingBar() {
        viewModel.isLoading.observe(this, Observer {
            // Show the loading bar when communicating with the server.
            showProgress(it)
        })
    }

    private fun setupAddressInput() {
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

        address.setText(viewModel.savedAddress.value!!.peekContent())

        viewModel.savedAddress.observe(this, Observer { urlEvent ->
            urlEvent.getContentIfNotHandled()?.let {
                // When saved URL updates, exit this activity.
                finish()
            }
        })
        viewModel.errorResource.observe(this, Observer {
            // Show error, if any.
            address_container.error = it.peekContent()?.let(this::getString)

            // When error updates and is not-null, focus on the address input.
            it.getContentIfNotHandled()?.let {
                address.requestFocus()
            }
        })
    }

    /** Update the debug text */
    private fun setupDebugText() {
        val info = getCellInfo(resources.displayMetrics)
        debug_uuid.text = getString(R.string.debug_uuid, viewModel.uuid)
        debug_device_name.text = getString(R.string.debug_device_name, info.deviceName)
        debug_density.text = getString(R.string.debug_density, info.density)
        debug_display.text = getString(R.string.debug_display, info.widthPixels, info.heightPixels)
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
