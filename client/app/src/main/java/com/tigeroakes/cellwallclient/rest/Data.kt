package com.tigeroakes.cellwallclient.rest

object Data {
    data class Configure(val backgroundColor: String, val icon: String)
    data class Text(val text: String)
    data class Image(val src: String)
    data class Button(val backgroundColor: String)
}