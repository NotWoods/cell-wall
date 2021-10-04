package com.tigeroakes.cellwall.client.ui.text

import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.databinding.FragmentLargeTextBinding
import com.tigeroakes.cellwall.client.ui.ViewBindingFragment

class LargeTextFragment : ViewBindingFragment<FragmentLargeTextBinding>() {

  private val args: LargeTextFragmentArgs by navArgs()

  override fun inflateLayout(
    inflater: LayoutInflater,
    container: ViewGroup?
  ) = FragmentLargeTextBinding.inflate(inflater, container, false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    binding!!.textContainer.background = ColorDrawable(args.backgroundColor)
    binding!!.largeText.text = args.text
  }
}
