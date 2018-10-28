package com.tigeroakes.cellwallclient.model

import java.util.*

data class RegisterCellRequest(
        val deviceName: String,
        val density: Int,
        val widthPixels: Int,
        val heightPixels: Int
)
