package com.tigeroakes.cellwallclient.ui.main

import android.view.Gravity

private val edges = listOf(
        Gravity.BOTTOM,
        Gravity.TOP,
        Gravity.START,
        Gravity.END
)

fun randomEdge() = edges.random()

fun oppositeEdge(edge: Int) = when (edge) {
    Gravity.BOTTOM -> Gravity.TOP
    Gravity.TOP -> Gravity.BOTTOM
    Gravity.START -> Gravity.END
    Gravity.END -> Gravity.START
    else -> Gravity.TOP
}
