package com.tigeroakes.cellwallclient.ui.login

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.os.Bundle
import android.preference.PreferenceManager
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.edit
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import kotlinx.android.synthetic.main.login_activity.*

/**
 * A login screen that offers login via email/password.
 */
class LoginActivity : AppCompatActivity() {
    private lateinit var viewModel: LoginViewModel

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.login_activity)

        viewModel = ViewModelProviders.of(this).get(LoginViewModelImpl::class.java)

        // Set up the login form.
        address.setOnEditorActionListener(TextView.OnEditorActionListener { _, id, _ ->
            if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                attemptLogin()
                return@OnEditorActionListener true
            }
            false
        })

        connect_button.setOnClickListener { attemptLogin() }

        val prefs = PreferenceManager.getDefaultSharedPreferences(this)
        prefs.getString(SERVER_ADDRESS_KEY, null)?.let {
            address.setText(it)
        }

        viewModel.errorText.observe(this, Observer {
            address.error = it.peekContent()

            it.getContentIfNotHandled()?.let {
                address.requestFocus()
            }
        })
        viewModel.savedAddress.observe(this, Observer { urlEvent ->
            urlEvent.getContentIfNotHandled()?.let { url ->
                prefs.edit {
                    putString(SERVER_ADDRESS_KEY, url.toString())
                }
                // TODO pass string in activity result
                // maybe just move address storage to Repository
                finish()
            }
        })
        viewModel.isLoading.observe(this, Observer {
            showProgress(it)
        })
    }

    /**
     * Attempts to connect to the server specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private fun attemptLogin() {
        viewModel.attemptLogin(address.text.toString())
    }

    /**
     * Shows the progress UI and hides the login form.
     */
    private fun showProgress(show: Boolean) {
        val shortAnimTime = resources.getInteger(android.R.integer.config_shortAnimTime).toLong()

        login_form.visibility = if (show) View.GONE else View.VISIBLE
        login_form.animate()
                .setDuration(shortAnimTime)
                .alpha((if (show) 0 else 1).toFloat())
                .setListener(object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) {
                        login_form.visibility = if (show) View.GONE else View.VISIBLE
                    }
                })

        login_progress.visibility = if (show) View.VISIBLE else View.GONE
        login_progress.animate()
                .setDuration(shortAnimTime)
                .alpha((if (show) 1 else 0).toFloat())
                .setListener(object : AnimatorListenerAdapter() {
                    override fun onAnimationEnd(animation: Animator) {
                        login_progress.visibility = if (show) View.VISIBLE else View.GONE
                    }
                })
    }
}
