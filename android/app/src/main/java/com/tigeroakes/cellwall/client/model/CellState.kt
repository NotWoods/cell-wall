package com.tigeroakes.cellwall.client.model

import android.graphics.Color.rgb
import android.net.Uri
import android.os.Bundle
import android.os.Parcel
import android.os.Parcelable
import android.widget.Button
import android.widget.ImageView
import androidx.annotation.ColorInt
import org.json.JSONObject
import org.w3c.dom.Text

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

  data class Web(val url: String) : CellState(CellStateType.WEB) {
    override fun writeToBundle(dest: Bundle) {
      super.writeToBundle(dest)
      dest.putString("url", url)
    }
  }

  companion object {
    const val STATE_KEY = "state"
    @ColorInt val COLOR_ACCENT = rgb(27, 94, 32)

    @JvmField
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
