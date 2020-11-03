package com.tigeroakes.cellwallclient.model

import android.graphics.Color
import androidx.annotation.ColorInt
import org.json.JSONObject

enum class CellStateType {
  BLANK,
  CONFIGURE,
  TEXT,
  IMAGE,
  BUTTON
}

/**
 * Enum representing different modes for a Cell, along with its associated data.
 */
sealed class CellState(val type: CellStateType) {
  /** Empty state */
  object Blank : CellState(CellStateType.BLANK)
  /**
   * Used when configuring Cell positions on the Wall. Cells display basic identifiers to help
   * the user see which displays they correspond to in the editor. They may instead display parts
   * of a whole image to check if the positions are set correctly.
   */
  data class Configure(val icon: String, @ColorInt val backgroundColor: Int) : CellState(CellStateType.CONFIGURE)
  data class Text(val text: String, @ColorInt val backgroundColor: Int) : CellState(CellStateType.TEXT)
  data class Image(val src: String) : CellState(CellStateType.IMAGE)
  data class Button(@ColorInt val backgroundColor: Int) : CellState(CellStateType.BUTTON)

  companion object {
    @JvmStatic
    @ColorInt
    private fun JSONObject.getColor(name: String) = Color.parseColor(getString(name))

    /**
     * Return the CellState object corresponding to the given mode.
     * CellState fields are populated using the provided JSON data.
     */
    @JvmStatic
    fun from(json: JSONObject): CellState {
      val mode = json.getString("type")
      return json.run {
        when (mode) {
          "CONFIGURE" -> Configure(
            icon = getString("icon"),
            backgroundColor = getColor("backgroundColor"),
          )
          "TEXT" -> Text(
            text = getString("text"),
            backgroundColor = getColor("backgroundColor")
          )
          "IMAGE" -> Image(getString("src"))
          "BUTTON" -> Button(getColor("backgroundColor"))
          else -> Blank
        }
      }
    }
  }
}
