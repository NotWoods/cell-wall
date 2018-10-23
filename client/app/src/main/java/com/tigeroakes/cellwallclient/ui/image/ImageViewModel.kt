package com.tigeroakes.cellwallclient.ui.image

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

interface ImageViewModel {
    val imageSrc: LiveData<String>

    fun setImageSrc(src: String)
}

class ImageViewModelImpl : ImageViewModel, ViewModel() {
    override val imageSrc = MutableLiveData<String>()

    override fun setImageSrc(src: String) {
        imageSrc.value = src
    }
}
