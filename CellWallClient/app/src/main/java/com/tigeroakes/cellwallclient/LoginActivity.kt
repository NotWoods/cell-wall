package com.tigeroakes.cellwallclient

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.annotation.TargetApi
import androidx.appcompat.app.AppCompatActivity
import android.app.LoaderManager.LoaderCallbacks
import android.content.Intent
import android.database.Cursor
import android.os.AsyncTask
import android.os.Build
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import android.view.View
import android.view.inputmethod.EditorInfo
import android.widget.TextView

import android.webkit.URLUtil
import com.tigeroakes.cellwallclient.SocketManager.createSocket
import io.socket.client.IO
import io.socket.client.Socket

import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.coroutines.experimental.Deferred
import kotlinx.coroutines.experimental.android.UI
import kotlinx.coroutines.experimental.async
import org.jetbrains.anko.coroutines.experimental.bg
import kotlin.coroutines.experimental.suspendCoroutine

/**
 * A login screen that offers login via email/password.
 */
class LoginActivity : AppCompatActivity() {
    private var connectingSocket = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)
        // Set up the login form.
        address.setOnEditorActionListener(TextView.OnEditorActionListener { _, id, _ ->
            if (id == EditorInfo.IME_ACTION_DONE || id == EditorInfo.IME_NULL) {
                attemptLogin()
                return@OnEditorActionListener true
            }
            false
        })

        connect_button.setOnClickListener { attemptLogin() }
    }

    /**
     * Attempts to sign in or register the account specified by the login form.
     * If there are form errors (invalid email, missing fields, etc.), the
     * errors are presented and no actual login attempt is made.
     */
    private fun attemptLogin() {
        if (connectingSocket) {
            return
        }

        // Reset errors.
        address.error = null

        // Store values at the time of the login attempt.
        val addressStr = address.text.toString()

        var cancel = false

        // Check for a valid address
        if (TextUtils.isEmpty(addressStr)) {
            address.error = getString(R.string.error_field_required)
            cancel = true
        } else if (!isUrlValid(addressStr)) {
            address.error = getString(R.string.error_invalid_address)
            cancel = true
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the
            // form field with an error.
            address.requestFocus()
        } else {
            // Show a progress spinner, and start connecting with a socket
            showProgress(true)
            connectingSocket = true
            val sharedPrefs = getDefaultSharedPreferences(this)
            val socket = createSocket(addressStr, sharedPrefs)
            socket.on(Socket.EVENT_CONNECT) {
                showProgress(false)
                startActivity(Intent(this, MainActivity::class.java))
                connectingSocket = false
            }.on(Socket.EVENT_CONNECT_ERROR) {
                connectingSocket = false
                showProgress(false)
                address.error = getString(R.string.error_incorrect_address)
            }
            socket.connect()
        }
    }

    private fun isUrlValid(url: String) = URLUtil.isValidUrl(url)

    /**
     * Shows the progress UI and hides the login form.
     */
    @TargetApi(Build.VERSION_CODES.HONEYCOMB_MR2)
    private fun showProgress(show: Boolean) {
        // On Honeycomb MR2 we have the ViewPropertyAnimator APIs, which allow
        // for very easy animations. If available, use these APIs to fade-in
        // the progress spinner.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.HONEYCOMB_MR2) {
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
        } else {
            // The ViewPropertyAnimator APIs are not available, so simply show
            // and hide the relevant UI components.
            login_progress.visibility = if (show) View.VISIBLE else View.GONE
            login_form.visibility = if (show) View.GONE else View.VISIBLE
        }
    }
}
