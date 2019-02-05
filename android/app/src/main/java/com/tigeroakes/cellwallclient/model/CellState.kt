package com.tigeroakes.cellwallclient.model

import org.json.JSONObject

/**
 * Enum representing different modes for a Cell, along with its associated data.
 */
sealed class CellState {
    /** Empty state */
    object Blank : CellState()
    /**
     * Used when configuring Cell positions on the Wall. Cells display basic identifiers to help
     * the user see which displays they correspond to in the editor. They may instead display parts
     * of a whole image to check if the positions are set correctly.
     */
    data class Configure(val backgroundColor: String, val icon: String) : CellState()
    data class Text(val text: String) : CellState()
    data class Image(val src: String) : CellState()
    data class Button(val backgroundColor: String) : CellState()

    companion object {
        /**
         * Return the CellState object corresponding to the given mode.
         * CellState fields are populated using the provided JSON data.
         */
        fun from(json: JSONObject): CellState {
            val mode = json.getString("type")
            val data = json.getJSONObject("data")
            return data.run {
                when (mode) {
                    "CONFIGURE" -> Configure(
                            getString("backgroundColor"),
                            getString("icon")
                    )
                    "TEXT" -> Text(getString("text"))
                    "IMAGE" -> Image(getString("src"))
                    "BUTTON" -> Button(getString("backgroundColor"))
                    else -> Blank
                }
            }
        }
    }
}