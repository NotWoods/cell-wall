package com.tigeroakes.cellwall.client.ui.text

import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.R
import kotlinx.android.synthetic.main.fragment_large_text.*

class LargeTextFragment : Fragment(R.layout.fragment_large_text) {
  private val args: LargeTextFragmentArgs by navArgs()

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    text_container.background = ColorDrawable(args.backgroundColor)
    large_text.text = args.text
  }
}
