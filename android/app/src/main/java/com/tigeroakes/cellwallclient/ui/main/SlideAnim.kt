package com.tigeroakes.cellwallclient.ui.main

import androidx.annotation.AnimRes
import com.tigeroakes.cellwallclient.R

object SlideAnim {
    data class Animations(
            @AnimRes val slideIn: Int,
            @AnimRes val slideOut: Int
    )

    private val slideAnimations = listOf(
            Animations(R.anim.slide_in_from_right, R.anim.slide_out_to_left),
            Animations(R.anim.slide_in_from_left, R.anim.slide_out_to_right),
            Animations(R.anim.slide_in_from_bottom, R.anim.slide_out_to_top),
            Animations(R.anim.slide_in_from_top, R.anim.slide_out_to_bottom)
    )

    fun random() = slideAnimations.random()
}
