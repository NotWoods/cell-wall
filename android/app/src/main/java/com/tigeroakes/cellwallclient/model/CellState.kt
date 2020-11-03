package com.tigeroakes.cellwallclient.model

import com.squareup.moshi.adapters.PolymorphicJsonAdapterFactory

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
  data class Configure(val backgroundColor: String, val icon: String) : CellState(CellStateType.CONFIGURE)
  data class Text(val text: String) : CellState(CellStateType.TEXT)
  data class Image(val src: String) : CellState(CellStateType.IMAGE)
  data class Button(val backgroundColor: String) : CellState(CellStateType.BUTTON)
}

val cellStateAdapter = PolymorphicJsonAdapterFactory.of(CellState::class.java, "type")
  .withSubtype(CellState.Blank::class.java, CellStateType.BLANK.name)
  .withSubtype(CellState.Configure::class.java, CellStateType.CONFIGURE.name)
  .withSubtype(CellState.Text::class.java, CellStateType.TEXT.name)
  .withSubtype(CellState.Image::class.java, CellStateType.IMAGE.name)
  .withSubtype(CellState.Button::class.java, CellStateType.BUTTON.name)
