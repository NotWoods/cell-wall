package com.tigeroakes.cellwallclient.ui.image

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.data.CellWallRepository
import java.net.URI

interface ImageViewModel {
    val imageSrc: LiveData<String>

    fun setImageSrc(src: String)
}

class ImageViewModelImpl(private val repository: CellWallRepository) : ImageViewModel, ViewModel() {
    override val imageSrc = MutableLiveData<String>()

    override fun setImageSrc(src: String) {
        imageSrc.value = repository.addImageHost(src).toString()
    }
}
