package com.tigeroakes.cellwallclient.ui.image

import androidx.lifecycle.ViewModelProviders
import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.Observer
import com.bumptech.glide.Glide

import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.image_fragment.*

class ImageFragment : Fragment(), Observer<String> {

    companion object {
        private const val ARG_IMAGE_SRC = "image_src"

        fun newInstance(src: String) = ImageFragment().apply {
            arguments = Bundle().apply { putString(ARG_IMAGE_SRC, src) }
        }
    }

    private lateinit var viewModel: ImageViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.image_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)
        viewModel = ViewModelProviders.of(this).get(ImageViewModel::class.java)

        arguments?.run {
            getString(ARG_IMAGE_SRC)?.let { viewModel.setImageSrc(it) }
        }

        viewModel.getImageSrc().observe(this, this)
    }

    override fun onChanged(imageSrc: String?) {
        Glide.with(this).load(imageSrc).into(image)
    }
}
