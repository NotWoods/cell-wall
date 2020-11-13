package com.tigeroakes.cellwallclient.ui.image

import android.os.Bundle
import android.view.View
import android.widget.ImageView
import androidx.fragment.app.Fragment
import androidx.fragment.app.viewModels
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.fragment_image.*

class ImageFragment : Fragment(R.layout.fragment_image) {

  private val args by navArgs<ImageFragmentArgs>()
  private val viewModel by viewModels<ImageViewModel>()

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    viewModel.loadImage(args.src)
  }

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    image.scaleType = try {
      ImageView.ScaleType.valueOf(args.scaleType)
    } catch (err: IllegalArgumentException) {
      ImageView.ScaleType.FIT_CENTER
    }

    viewModel.image.observe(viewLifecycleOwner) {
      image.setImageBitmap(it)
    }
  }
}
