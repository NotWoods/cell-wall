package com.tigeroakes.cellwallclient.rest

import com.tigeroakes.cellwallclient.ui.main.CellMode

object Data {
    interface Data

    class Blank: Data
    data class Configure(val backgroundColor: String, val icon: String): Data
    data class Text(val text: String): Data
    data class Image(val src: String): Data
    data class Button(val backgroundColor: String): Data

    data class State(val mode: CellMode, val data: Data)
}