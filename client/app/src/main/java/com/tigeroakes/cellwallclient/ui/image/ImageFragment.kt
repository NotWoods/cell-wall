package com.tigeroakes.cellwallclient.ui.image

import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.core.net.toUri
import androidx.core.os.bundleOf
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.bumptech.glide.Glide
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY
import com.tigeroakes.cellwallclient.socket.ServerUris.addImageHost
import kotlinx.android.synthetic.main.image_fragment.*

class ImageFragment : Fragment(), Observer<String> {

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
        viewModel = ViewModelProviders.of(this).get(ImageViewModelImpl::class.java)
        viewModel.imageSrc.observe(this, this)

        arguments?.getString(ARG_IMAGE_SRC)?.let {
            viewModel.setImageSrc(it)
        }
    }

    override fun onChanged(imageSrc: String?) {
        val sharedPrefs = getDefaultSharedPreferences(context)
        val serverAddress = sharedPrefs.getString(SERVER_ADDRESS_KEY, null)!!.toUri()

        Glide.with(this).load(addImageHost(imageSrc, serverAddress)).into(image)
    }
}
