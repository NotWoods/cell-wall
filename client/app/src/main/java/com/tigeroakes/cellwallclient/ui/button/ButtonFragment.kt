package com.tigeroakes.cellwallclient.ui.button

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf

import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.button_fragment.*

class ButtonFragment : Fragment() {

    companion object {
        private const val ARG_BACKGROUND_COLOR = "background_color"

        fun newInstance(backgroundColor: String) = ButtonFragment().apply {
            arguments = bundleOf(ARG_BACKGROUND_COLOR to backgroundColor)
        }
    }

    private lateinit var viewModel: ButtonViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.button_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(ButtonViewModel::class.java)

        arguments?.run {
            getString(ARG_BACKGROUND_COLOR)?.let { viewModel.setBackgroundColor(it) }
        }

        // TODO: Use viewModel
    }

}
