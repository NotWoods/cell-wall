package com.tigeroakes.cellwallclient.ui.blank

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import com.tigeroakes.cellwallclient.R

class BlankFragment : Fragment() {
    companion object {
        fun newInstance() = BlankFragment()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View {
        return inflater.inflate(R.layout.blank_fragment, container, false)
    }
}
