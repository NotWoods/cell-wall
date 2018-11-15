package com.tigeroakes.cellwallclient.ui.main

import android.app.slice.Slice
import android.view.Gravity
import androidx.transition.Slide
import kotlin.random.Random

private val edges = listOf(
        Gravity.BOTTOM,
        Gravity.TOP,
        Gravity.START,
        Gravity.END
)

fun randomSlideDir(): Slide {
    val randomDir = edges[Random.nextInt(0, edges.size)]
    return Slide(randomDir)
}
