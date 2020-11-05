package com.tigeroakes.cellwallclient.device

import android.os.Build.VERSION.SDK_INT
import android.os.Build.VERSION_CODES
import android.view.View.*
import android.view.Window
import android.view.WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat

object Immersive {

  @Suppress("Deprecation")
  private const val VISIBILITY_FLAGS = SYSTEM_UI_FLAG_HIDE_NAVIGATION or
    SYSTEM_UI_FLAG_FULLSCREEN or
    SYSTEM_UI_FLAG_IMMERSIVE

  /**
   * Hides system bars.
   * https://developer.android.com/training/system-ui/immersive
   */
  fun enterImmersiveMode(window: Window) {
    WindowCompat.setDecorFitsSystemWindows(window, false)
    if (SDK_INT >= VERSION_CODES.R) {
      val controller = window.decorView.windowInsetsController!!
      controller.systemBarsBehavior = BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE

      controller.hide(WindowInsetsCompat.Type.systemBars())
    } else {
      @Suppress("Deprecation")
      window.decorView.systemUiVisibility = window.decorView.systemUiVisibility or VISIBILITY_FLAGS
    }
  }
}
