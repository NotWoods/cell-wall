package com.tigeroakes.cellwallclient.ui.image

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.data.CellWallRepository
import java.net.URI

interface ImageViewModel {
    val imageSrc: LiveData<URI>

    fun setImageSrc(src: String)
}

class ImageViewModelImpl(private val repository: CellWallRepository) : ImageViewModel, ViewModel() {
    override val imageSrc = MutableLiveData<URI>()

    override fun setImageSrc(src: String) {
        imageSrc.value = repository.addImageHost(src)
    }
}
