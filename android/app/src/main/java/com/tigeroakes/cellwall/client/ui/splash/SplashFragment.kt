package com.tigeroakes.cellwall.client.ui.splash

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import com.tigeroakes.cellwall.client.R
import com.tigeroakes.cellwall.client.device.getCellInfo
import kotlinx.android.synthetic.main.activity_login.*

class SplashFragment : Fragment(R.layout.fragment_splash) {

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    setupDebugText()
  }

  /** Update the debug text */
  private fun setupDebugText() {
    val info = getCellInfo(resources.displayMetrics)
    debug_density.text = getString(R.string.debug_density, info.density)
    debug_display.text = getString(R.string.debug_display_dp, info.width, info.height)
  }
}
