package com.tigeroakes.cellwallclient

import android.animation.Animator
import android.animation.AnimatorListenerAdapter
import android.annotation.TargetApi
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.support.v4.app.Fragment
import android.text.TextUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.URLUtil
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.viewmodels.LoginViewModel
import java.nio.file.Paths
import okhttp3.Request

class LoginFragment : Fragment() {
    private var connectingSocket = false
    private lateinit var viewModel: LoginViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.fragment_login, container, false)
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
        viewModel.clearError()

        // Store values at the time of the login attempt.
        val addressStr = address.text.toString()

        var cancel = false

        // Check for a valid address
        if (TextUtils.isEmpty(addressStr)) {
            viewModel.setErrorText(getString(R.string.error_field_required))
            cancel = true
        } else if (!isUrlValid(addressStr)) {
            viewModel.setErrorText(getString(R.string.error_invalid_address))
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

            val url = Paths.get(addressStr, "cell")
            val request = Request.Builder()
                    .url(url.toString())
                    .build()

            val response = OKHttpClient().newCall(request).execute()
            if (response.isSuccessful()) {
                // Save the new address
                getDefaultSharedPreferences(getActivity()).edit(commit = true) {
                    putString(SERVER_ADDRESS_KEY, addressStr)
                }

                // Open the main activity
                getActivity()
                        .supportFragmentManager.beginTransaction()
                        .replace(R.id.container, StartFragment.newInstance())
                        .commitNow()
            } else {
                connectingSocket = false
                showProgress(false)

                viewModel.setErrorText(getString(R.string.error_incorrect_address))
                address.requestFocus()
            }
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

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LoginViewModel::class.java)
    }

    companion object {
        fun newInstance() = LoginFragment()
    }
}
