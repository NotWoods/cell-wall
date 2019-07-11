package com.tigeroakes.cellwallclient.ui.image

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.squareup.picasso.Picasso
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.data.CellWallRepositoryImpl
import com.tigeroakes.cellwallclient.ui.RepositoryViewModelFactory
import kotlinx.android.synthetic.main.image_fragment.*

class ImageFragment : Fragment() {

    companion object {
        private const val ARG_IMAGE_SRC = "image_src"

        fun newInstance(src: String) = ImageFragment().apply {
            arguments = bundleOf(ARG_IMAGE_SRC to src)
        }
    }

    private lateinit var viewModel: ImageViewModel

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        return inflater.inflate(R.layout.image_fragment, container, false)
    }

    override fun onActivityCreated(savedInstanceState: Bundle?) {
        super.onActivityCreated(savedInstanceState)

        val factory = RepositoryViewModelFactory(
                CellWallRepositoryImpl.getInstance(
                        getDefaultSharedPreferences(requireContext().applicationContext)
                )
        )
        viewModel = ViewModelProviders.of(this, factory).get(ImageViewModelImpl::class.java)

        setupImage()

        arguments?.getString(ARG_IMAGE_SRC)?.let {
            viewModel.setImageSrc(it)
        }
    }

    private fun setupImage() {
        viewModel.imageSrc.observe(viewLifecycleOwner, Observer { imageUrl ->
            Picasso.with(context)
                .load(imageUrl)
                .centerCrop()
                .error(ColorDrawable(Color.RED))
                .into(image)
        })
    }
}
