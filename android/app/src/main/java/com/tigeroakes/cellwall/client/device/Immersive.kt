package com.tigeroakes.cellwall.client.device

import android.os.Build
import android.os.Build.VERSION.SDK_INT
import android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
import android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
import android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
import android.view.Window
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

object Immersive {

  /**
   * Hides system bars.
   * https://developer.android.com/training/system-ui/immersive
   */
  fun enterImmersiveMode(window: Window) {
    WindowCompat.setDecorFitsSystemWindows(window, false)

    @Suppress("Deprecation")
    if (SDK_INT == Build.VERSION_CODES.KITKAT) {
      val decorView = window.decorView
      decorView.systemUiVisibility = decorView.systemUiVisibility or
        SYSTEM_UI_FLAG_HIDE_NAVIGATION or
        SYSTEM_UI_FLAG_FULLSCREEN or
        SYSTEM_UI_FLAG_IMMERSIVE_STICKY
    }

    val controller = WindowInsetsControllerCompat(window, window.decorView)
    controller.systemBarsBehavior = BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    controller.hide(WindowInsetsCompat.Type.systemBars())
  }
}
