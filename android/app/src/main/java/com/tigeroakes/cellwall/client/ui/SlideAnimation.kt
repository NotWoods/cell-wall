package com.tigeroakes.cellwall.client.ui

import androidx.annotation.AnimRes
import com.tigeroakes.cellwall.client.R

enum class SlideAnimation(
  @AnimRes val enterResId: Int,
  @AnimRes val exitResId: Int,
) {
  BOTTOM(R.anim.slide_in_bottom, R.anim.slide_out_bottom),
  TOP(R.anim.slide_in_top, R.anim.slide_out_top),
  LEFT(R.anim.slide_in_left, R.anim.slide_out_left),
  RIGHT(R.anim.slide_in_right, R.anim.slide_out_right);

  companion object {
    fun randomEdge() = values().random()
  }
}
