package com.tigeroakes.cellwallclient.ui.text

import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.fragment_large_text.*

class LargeTextFragment : Fragment(R.layout.fragment_large_text) {
  private val args: LargeTextFragmentArgs by navArgs()

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    text_container.background = ColorDrawable(args.background)
    large_text.text = args.text
  }
}
