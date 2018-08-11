package com.tigeroakes.cellwallclient.ui.login

import android.content.Context
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.content.edit
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import com.tigeroakes.cellwallclient.rest.CellWallServerService
import kotlinx.android.synthetic.main.login_fragment.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.IOException

/**
 * The login screen is responsible for letting the user set the address of the CellWall server
 * where the socket is accessible. One entered, it verifies that the URL is valid by pinging the
 * server at the "/is-cellwall-server" path. If the server returns a 204 status, then the
 * new address is saved and the onServerVerified method is called.
 */
class LoginFragment : Fragment(), Callback<Unit>, Observer<String> {
    companion object {
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
        viewModel.getErrorText().observe(this, this)
    }

    /**
     * Called when the error text in the view model changes.
     * Used to display the current error, if any.
     */
    override fun onChanged(errorText: String) {
        address_layout.error = errorText
        address_layout.isErrorEnabled = TextUtils.isEmpty(errorText)
    }

    /**
     * Called when the /is-cellwall-server request fails
     */
    override fun onFailure(call: Call<Unit>?, error: Throwable?) {
        val errorText = when (error) {
            is IOException -> getString(R.string.error_incorrect_address)
            is IllegalArgumentException -> getString(R.string.error_connection_failed)
            else -> error.toString()
        }
        viewModel.setErrorText(errorText)
        address.requestFocus()
    }

    /**
     * Called when the /is-cellwall-server request succeeds.
     */
    override fun onResponse(call: Call<Unit>?, response: Response<Unit>?) {
        val addressStr = address.text.toString()
        sharedPrefs.edit {
            putString(SERVER_ADDRESS_KEY, addressStr)
        }
        callback.onServerVerified(addressStr)
    }

    private fun attemptLogin() {
        // Store values at the time of the login attempt.
        val addressStr = address.text.toString()

        val isValid = viewModel.validateAddress(addressStr) {
            getString(it)
        }

        if (isValid) {
            testAddress(addressStr)
        } else {
            // There was an error; don't attempt login and focus the
            // form field with an error.
            address.requestFocus()
        }
    }

    /**
     * Tests to ensure that an address points to a CellWall server by making a HTTP request.
     * If it finds a server, {@link MainFragment} is opened.
     * @param address Address to check
     */
    private fun testAddress(address: String) {
        CellWallServerService.create(address)
                .isServer()
                .enqueue(this)
    }
}
