package com.tigeroakes.cellwallclient.ui.main

import android.annotation.SuppressLint
import android.os.Handler
import android.view.View
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Transformations
import androidx.lifecycle.ViewModel
import com.tigeroakes.cellwallclient.CellState
import com.tigeroakes.cellwallclient.socket.SocketLiveData
import org.json.JSONObject

class MainViewModel : ViewModel() {
    private val hideHandler = Handler()

    private val systemUiVisibility = MutableLiveData<Int>()
    private val appBarVisible = MutableLiveData<Boolean>()

    val stateRawData = SocketLiveData()
    val state: LiveData<CellState> = Transformations.map(stateRawData) {
        CellState.from(it[0] as String, it[1] as JSONObject)
    }

    fun getSystemUiVisibility(): LiveData<Int> = systemUiVisibility
    fun getAppBarVisible(): LiveData<Boolean> = appBarVisible

    @SuppressLint("InlinedApi")
    fun hideSystemUi() {
        // Delayed removal of status and navigation bar

        // Note that some of these constants are new as of API 16 (Jelly Bean)
        // and API 19 (KitKat). It is safe to use them, as they are inlined
        // at compile-time and do nothing on earlier devices.
        systemUiVisibility.value =
                View.SYSTEM_UI_FLAG_LOW_PROFILE or
                View.SYSTEM_UI_FLAG_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
    }

    @SuppressLint("InlinedApi")
    fun showSystemUi() {
        // Show the system bar
        systemUiVisibility.value =
                View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
    }

    fun hideAppBar() {
        appBarVisible.value = false
    }

    fun showAppBar() {
        appBarVisible.value = true
    }
}
