package com.tigeroakes.cellwall.client.ui.image

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.databinding.FragmentImageBinding
import com.tigeroakes.cellwall.client.ui.ViewBindingFragment

class ImageFragment : ViewBindingFragment<FragmentImageBinding>() {

  private val args by navArgs<ImageFragmentArgs>()
  private val viewModel by viewModels<ImageViewModel>()

  override fun inflateLayout(
    inflater: LayoutInflater,
    container: ViewGroup?
  ) = FragmentImageBinding.inflate(inflater, container, false)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    viewModel.loadImage(args.src)
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    binding?.image?.scaleType = try {
      ImageView.ScaleType.valueOf(args.scaleType)
    } catch (err: IllegalArgumentException) {
      ImageView.ScaleType.FIT_CENTER
    }

    viewModel.image.observe(viewLifecycleOwner) {
      binding?.image?.setImageBitmap(it)
    }
  }
}
