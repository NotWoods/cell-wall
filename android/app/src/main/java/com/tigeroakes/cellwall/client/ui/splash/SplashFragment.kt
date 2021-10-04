package com.tigeroakes.cellwall.client.ui.splash

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import com.tigeroakes.cellwall.client.R
import com.tigeroakes.cellwall.client.databinding.FragmentSplashBinding
import com.tigeroakes.cellwall.client.device.getCellInfo
import com.tigeroakes.cellwall.client.ui.ViewBindingFragment

class SplashFragment : ViewBindingFragment<FragmentSplashBinding>() {

  override fun inflateLayout(
    inflater: LayoutInflater,
    container: ViewGroup?
  ) = FragmentSplashBinding.inflate(inflater, container, false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    setupDebugText()
  }

  /** Update the debug text */
  private fun setupDebugText() {
    val info = getCellInfo(resources.displayMetrics)
    binding!!.debugDensity.text = getString(R.string.debug_density, info.density)
    binding!!.debugDisplay.text = getString(R.string.debug_display_dp, info.width, info.height)
  }
}
