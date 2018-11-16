package com.tigeroakes.cellwallclient.ui.text

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.large_text_fragment.*

class LargeTextFragment : Fragment() {

    companion object {
        private const val ARG_TEXT = "text"

        private val BACKGROUNDS = listOf(R.color.colorPrimary, R.color.accent1, R.color.accent2)

        fun newInstance(text: String) = LargeTextFragment().apply {
            arguments = bundleOf(ARG_TEXT to text)
        }
    }

    private lateinit var viewModel: LargeTextViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.large_text_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(LargeTextViewModelImpl::class.java)

        setupText()

        setupBackground()

        arguments?.run {
            getString(ARG_TEXT)?.let { viewModel.setText(it) }
        }
    }

    private fun setupText() {
        viewModel.text.observe(viewLifecycleOwner, Observer { text ->
            large_text.text = text
        })
    }

    private fun setupBackground() {
        text_container.setBackgroundResource(BACKGROUNDS.random())
    }
}
