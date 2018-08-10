package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.Observer
import com.tigeroakes.cellwallclient.Installation

import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import com.tigeroakes.cellwallclient.rest.CellWallServerService
import com.tigeroakes.cellwallclient.rest.Data
import kotlinx.android.synthetic.main.large_text_fragment.*

class LargeTextFragment : Fragment(), Observer<Data.Text> {

    companion object {
        fun newInstance() = LargeTextFragment()
    }

    private lateinit var viewModel: LargeTextViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.large_text_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LargeTextViewModel::class.java)

        val sharedPrefs = getDefaultSharedPreferences(context)
        viewModel.getText(
                Installation.id(sharedPrefs),
                CellWallServerService.create(sharedPrefs.getString(SERVER_ADDRESS_KEY, null)!!)
        ).observe(this, this)
    }

    override fun onChanged(data: Data.Text) {
        large_text.text = data.text
    }
}
