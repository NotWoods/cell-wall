package com.tigeroakes.cellwallclient

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.tigeroakes.cellwallclient.viewmodels.StartViewModel

class StartFragment : Fragment() {

    companion object {
        fun newInstance() = StartFragment()
    }

    private lateinit var viewModel: StartViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.fragment_start, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(StartViewModel::class.java)
        val serverAddress = viewModel.getServerAddress(getDefaultSharedPreferences(context))
    }
}
