package com.tigeroakes.cellwallclient.ui.main

import android.view.Gravity

private val edges = listOf(
        Gravity.BOTTOM,
        Gravity.TOP,
        Gravity.START,
        Gravity.END
)

fun randomEdge() = edges.random()
