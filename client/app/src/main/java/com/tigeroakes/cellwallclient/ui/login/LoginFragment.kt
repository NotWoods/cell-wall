package com.tigeroakes.cellwallclient.ui.login

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.os.Handler
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.text.TextUtils
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.annotation.StringRes
import androidx.core.content.edit
import androidx.core.net.toUri
import androidx.core.os.bundleOf
import androidx.core.view.updateLayoutParams
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import com.tigeroakes.cellwallclient.device.getSystemDimension
import kotlinx.android.synthetic.main.login_fragment.*

/**
 * The login screen is responsible for letting the user set the address of the CellWall server
 * where the socket is accessible. One entered, it verifies that the URL is valid by pinging the
 * server at the "/is-cellwall-server" path. If the server returns a 204 status, then the
 * new address is saved and the onServerVerified method is called.
 */
class LoginFragment : Fragment() {
    companion object {
        private const val ARG_AS_CHILD = "as_child"

        fun newInstance(asChild: Boolean) = LoginFragment().apply {
            arguments = bundleOf(ARG_AS_CHILD to asChild)
        }
    }

    interface OnServerVerifiedListener {
        fun onServerVerified(serverAddress: Uri)
    }

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
        return inflater.inflate(R.layout.login_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LoginViewModelImpl::class.java)
        // Display current error, if any
        viewModel.errorText.observe(this, Observer { error ->
            val isError = !error.isNullOrEmpty()

            address_layout.error = error
            address_layout.isErrorEnabled = !error.isNullOrEmpty()
            if (isError) { // TODO: Use Event
                address.requestFocus()
            }
        })
        viewModel.savedAddress.observe(this, Observer { urlEvent ->
            urlEvent.getContentIfNotHandled()?.let { url ->
                getDefaultSharedPreferences(activity).edit {
                    putString(SERVER_ADDRESS_KEY, url.toString())
                }
                callback.onServerVerified(url.toString().toUri())
            }
        })

        // Set click listener
        connect_button.setOnClickListener {
            // Tests to ensure that an address in the input points to a CellWall server
            // f it finds a server, BlankFragment is opened.
            viewModel.attemptLogin(address.text.toString())
        }

        // If a URL was previous set, use it as the default value
        getDefaultSharedPreferences(activity)
                .getString(SERVER_ADDRESS_KEY, null)?.let { address.setText(it) }

        // Set up an element with equal height to the status bar
        val statusBarHeight = resources.getSystemDimension("status_bar_height")
        status_bar_padding.updateLayoutParams {
            height = statusBarHeight
        }
        status_bar_padding.requestLayout()

        toolbar.setNavigationOnClickListener {
            fragmentManager?.popBackStack()
        }
        arguments?.run {
            if (!getBoolean(ARG_AS_CHILD)) {
                toolbar.navigationIcon = null
            }
        }
    }
}
