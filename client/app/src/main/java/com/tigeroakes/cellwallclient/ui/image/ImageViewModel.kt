package com.tigeroakes.cellwallclient.ui.image

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel

class ImageViewModel : ViewModel() {
    private val imageSrc: MutableLiveData<String> by lazy {
        MutableLiveData<String>()
    }

    fun getImageSrc(): LiveData<String> = imageSrc

    fun setImageSrc(src: String) {
        imageSrc.value = src
    }
}
