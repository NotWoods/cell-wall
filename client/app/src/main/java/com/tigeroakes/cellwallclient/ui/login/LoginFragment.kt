package com.tigeroakes.cellwallclient.ui.login

import android.content.Context
import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.webkit.URLUtil
import androidx.core.content.edit
import androidx.lifecycle.Observer
import okhttp3.OkHttpClient

import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import kotlinx.android.synthetic.main.login_fragment.*
import okhttp3.Request
import java.io.IOException
import java.net.URI

/**
 * The login screen is responsible for letting the user set the address of the CellWall server
 * where the socket is accessible. One entered, it verifies that the URL is valid by pinging the
 * server at the "/is-cellwall-server" path. If the server returns a 204 status, then the
 * new address is saved and the onServerVerified method is called.
 */
class LoginFragment : Fragment() {
    companion object {
        private val client = OkHttpClient()
        fun newInstance() = LoginFragment()
    }

    interface OnServerVerifiedListener {
        fun onServerVerified(serverAddress: String)
    }

    private val sharedPrefs = getDefaultSharedPreferences(activity)
    private lateinit var viewModel: LoginViewModel
    private lateinit var callback: OnServerVerifiedListener

    /**
     * When the fragment attaches, save a reference to its parent activity as an
     * OnServerVerifiedListener.
     */
    override fun onAttach(context: Context?) {
        super.onAttach(context)
        try {
            callback = activity as OnServerVerifiedListener
        } catch (e: ClassCastException) {
            throw ClassCastException(activity.toString() +
                    " must implement OnServerVerifiedListener")
        }
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.login_fragment, container, false)
        // Set click listener
        connect_button.setOnClickListener { attemptLogin() }
        // If a URL was previous set, use it as the default value
        sharedPrefs.getString(SERVER_ADDRESS_KEY, null)?.let { address.setText(it) }
        return view
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LoginViewModel::class.java)
        viewModel.getErrorText().observe(this, Observer { errorText ->
            address_layout.error = errorText
            address_layout.isErrorEnabled = TextUtils.isEmpty(errorText)
        })
    }

    private fun attemptLogin() {
        // Reset errors.
        viewModel.clearError()

        // Store values at the time of the login attempt.
        val addressStr = address.text.toString()

        var cancel = false

        // Check for a valid address
        if (TextUtils.isEmpty(addressStr)) {
            viewModel.setErrorText(getString(R.string.error_field_required))
            cancel = true
        } else if (!URLUtil.isValidUrl(addressStr)) {
            viewModel.setErrorText(getString(R.string.error_invalid_address))
            cancel = true
        }

        if (cancel) {
            // There was an error; don't attempt login and focus the
            // form field with an error.
            address.requestFocus()
        } else {
            try {
                testAddress(addressStr)
            } catch (e: IOException) {
                viewModel.setErrorText(getString(R.string.error_incorrect_address))
                address.requestFocus()
            } catch (e: IllegalArgumentException) {
                viewModel.setErrorText(getString(R.string.error_connection_failed))
                address.requestFocus()
            }
        }
    }

    /**
     * Tests to ensure that an address points to a CellWall server by making a HTTP request.
     * If it finds a server, {@link MainFragment} is opened.
     * @param address Address to check
     */
    private fun testAddress(address: String) {
        val url = URI(address).resolve("is-cellwall-server").toString()
        val request = Request.Builder().url(url).build()

        client.newCall(request).execute().use {
            if (it.isSuccessful) {
                // Save the new address
                sharedPrefs.edit(commit = true) {
                    putString(SERVER_ADDRESS_KEY, address)
                }

                // Open the main fragment
                callback.onServerVerified(address)
            } else {
                throw IllegalArgumentException()
            }
        }
    }
}
