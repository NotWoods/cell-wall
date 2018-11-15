package com.tigeroakes.cellwallclient.ui.button

import android.graphics.Color
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.data.CellWallRepository
import java.lang.IllegalArgumentException

interface ButtonViewModel {
    val backgroundColor: LiveData<Int>

    fun setBackgroundColor(hexCode: String)

    fun handleTouch()
}

class ButtonViewModelImpl(private val repository: CellWallRepository) : ButtonViewModel, ViewModel() {
    override val backgroundColor = MutableLiveData<Int>()

    override fun setBackgroundColor(hexCode: String) {
        try {
            backgroundColor.value = Color.parseColor(hexCode)
        } catch (e: IllegalArgumentException) {
            // ignore malformed hex codes
        }
    }

    override fun handleTouch() {
        repository.sendButtonTouch()
    }
}
