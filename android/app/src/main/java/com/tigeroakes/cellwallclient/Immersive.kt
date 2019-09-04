package com.tigeroakes.cellwallclient

import android.os.Build.VERSION_CODES
import android.os.Build.VERSION.SDK_INT
import android.view.View.*
import android.view.Window

object Immersive {
    
    private val VISIBILITY_FLAGS: Int

    init {
        var visibilityFlags = SYSTEM_UI_FLAG_HIDE_NAVIGATION
        if (SDK_INT >= VERSION_CODES.JELLY_BEAN) {
            visibilityFlags = visibilityFlags or
                    SYSTEM_UI_FLAG_LAYOUT_STABLE or
                    SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
                    SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
                    SYSTEM_UI_FLAG_FULLSCREEN
        }
        if (SDK_INT >= VERSION_CODES.KITKAT) {
            visibilityFlags = visibilityFlags or SYSTEM_UI_FLAG_IMMERSIVE
        }

        VISIBILITY_FLAGS = visibilityFlags
    }

    /**
     * Hides system bars.
     * https://developer.android.com/training/system-ui/immersive
     */
    fun enterImmersiveMode(window: Window) {
        window.decorView.systemUiVisibility = VISIBILITY_FLAGS
    }
}
