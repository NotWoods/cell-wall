package com.tigeroakes.cellwall.client.ui.image

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import androidx.lifecycle.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import java.net.URL

class ImageViewModel : ViewModel() {

  private val imageWithUrl = MutableLiveData<Pair<String, Bitmap>?>(null)
  val image: LiveData<Bitmap?> = Transformations.map(imageWithUrl) { pair -> pair?.second }

  fun loadImage(url: String) = viewModelScope.launch(Dispatchers.IO) {
    val stream = URL(url).openConnection().getInputStream()
    val bitmap = BitmapFactory.decodeStream(stream)
    imageWithUrl.postValue(url to bitmap)
  }
}
