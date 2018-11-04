package com.tigeroakes.cellwallclient.model

data class RegisterCellRequest(
        val deviceName: String,
        val density: Int,
        val widthPixels: Int,
        val heightPixels: Int
)
