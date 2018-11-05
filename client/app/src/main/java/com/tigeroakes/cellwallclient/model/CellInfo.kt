package com.tigeroakes.cellwallclient.model

import java.util.*

data class CellInfo(
        val uuid: UUID,
        val deviceName: String,
        val density: Int,
        val widthPixels: Int,
        val heightPixels: Int
)
