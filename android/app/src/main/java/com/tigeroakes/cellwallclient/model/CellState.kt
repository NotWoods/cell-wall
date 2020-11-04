package com.tigeroakes.cellwallclient.model

import android.graphics.Color
import android.net.Uri
import androidx.annotation.ColorInt
import org.json.JSONObject
import java.util.*

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
    /**
     * Return the CellState object corresponding to the given mode.
     * CellState fields are populated using the provided JSON data.
     */
    fun from(json: JSONObject): CellState {
      val mode = json.getString("type")
      return json.run {
        when (mode) {
          CellStateType.CONFIGURE.name -> Configure(
            icon = getString("icon"),
            backgroundColor = Color.parseColor(getString("backgroundColor")),
          )
          CellStateType.TEXT.name -> Text(
            text = getString("text"),
            backgroundColor = Color.parseColor(getString("backgroundColor"))
          )
          CellStateType.IMAGE.name -> Image(getString("src"))
          CellStateType.BUTTON.name -> Button(Color.parseColor(getString("backgroundColor")))
          else -> Blank
        }
      }
    }

    fun from(uri: Uri): CellState {
      if (uri.scheme != "cellwall") return Blank
      val type = uri.host?.toUpperCase(Locale.ROOT) ?: return Blank

      return uri.run {
        when (type) {
          CellStateType.CONFIGURE.name -> Configure(
            icon = getQueryParameter("icon")!!,
            backgroundColor = Color.parseColor(getQueryParameter("backgroundColor")),
          )
          CellStateType.TEXT.name -> Text(
            text = getQueryParameter("text")!!,
            backgroundColor = Color.parseColor(getQueryParameter("backgroundColor"))
          )
          CellStateType.IMAGE.name -> Image(getQueryParameter("src")!!)
          CellStateType.BUTTON.name -> Button(Color.parseColor(getQueryParameter("backgroundColor")))
          else -> Blank
        }
      }
    }
  }
}
