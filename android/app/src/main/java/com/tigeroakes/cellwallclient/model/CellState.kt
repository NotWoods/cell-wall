package com.tigeroakes.cellwallclient.model

import android.graphics.Color.rgb
import android.net.Uri
import android.os.Bundle
import android.os.Parcel
import android.os.Parcelable
import android.widget.ImageView
import androidx.annotation.ColorInt
import org.json.JSONObject

/**
 * Enum representing different modes for a Cell, along with its associated data.
 */
sealed class CellState(val type: CellStateType) : Parcelable {
  final override fun describeContents() = 0

  final override fun writeToParcel(dest: Parcel, flags: Int) {
    val bundle = Bundle().also { writeToBundle(it) }
    dest.writeBundle(bundle)
  }

  open fun writeToBundle(dest: Bundle) {
    dest.putString(CellStateType.TYPE, type.name)
  }

  /** Empty state */
  object Blank : CellState(CellStateType.BLANK)

  /**
   * Used when configuring Cell positions on the Wall. Cells display basic identifiers to help
   * the user see which displays they correspond to in the editor. They may instead display parts
   * of a whole image to check if the positions are set correctly.
   */
  data class Configure(
    val icon: String,
    @ColorInt val backgroundColor: Int
  ) : CellState(CellStateType.CONFIGURE) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putString("icon", icon)
      dest.putInt("backgroundColor", backgroundColor)
    }
  }

  data class Text(
    val text: String,
    @ColorInt val backgroundColor: Int
  ) : CellState(CellStateType.TEXT) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putString("text", text)
      dest.putInt("backgroundColor", backgroundColor)
    }
  }

  data class Image(
    val src: String,
    val scaleType: ImageView.ScaleType
  ) : CellState(CellStateType.IMAGE) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putString("src", src)
      dest.putString("scaleType", scaleType.name)
    }
  }

  data class Button(@ColorInt val backgroundColor: Int) : CellState(CellStateType.BUTTON) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putInt("backgroundColor", backgroundColor)
    }
  }

  data class Web(val url: String) : CellState(CellStateType.WEB) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putString("url", url)
    }
  }

  companion object {
    const val STATE_KEY = "state"
    @ColorInt val COLOR_ACCENT = rgb(27, 94, 32)

    @JvmStatic
    val CREATOR: Parcelable.Creator<CellState> = object : Parcelable.Creator<CellState> {
      override fun createFromParcel(source: Parcel): CellState =
        from(source.readBundle(javaClass.classLoader)!!)

      override fun newArray(size: Int): Array<CellState?> = arrayOfNulls(size)
    }

    /**
     * Return the CellState object corresponding to the given mode.
     * CellState fields are populated using the provided JSON data.
     */
    private fun from(container: Container): CellState = container.run {
      return when (type) {
        CellStateType.CONFIGURE -> Configure(
          icon = getString("icon")!!,
          backgroundColor = getColor("backgroundColor") ?: COLOR_ACCENT,
        )
        CellStateType.TEXT -> Text(
          text = getString("text")!!,
          backgroundColor = getColor("backgroundColor") ?: COLOR_ACCENT,
        )
        CellStateType.IMAGE -> Image(
          src = getString("src")!!,
          scaleType = getEnum<ImageView.ScaleType>("scaleType") ?: ImageView.ScaleType.FIT_CENTER,
        )
        CellStateType.BUTTON -> Button(
          backgroundColor = getColor("backgroundColor") ?: COLOR_ACCENT,
        )
        CellStateType.WEB -> Web(
          getString("url")!!,
        )
        else -> Blank
      }
    }

    fun from(json: JSONObject): CellState = from(JsonContainer(json))
    fun from(bundle: Bundle): CellState = from(BundleContainer(bundle))
    fun from(uri: Uri): CellState = when (uri.scheme) {
      "http", "https" -> Web(uri.toString())
      "cellwall" -> from(DataUriContainer(uri))
      else -> Blank
    }
  }
}
