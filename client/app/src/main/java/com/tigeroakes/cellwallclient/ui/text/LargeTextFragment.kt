package com.tigeroakes.cellwallclient.ui.text

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.tigeroakes.cellwallclient.R

class LargeTextFragment : Fragment() {

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
        // TODO: Use the ViewModel
    }

}
