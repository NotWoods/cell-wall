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
sealed class CellState(
  private val type: CellStateType
) : Parcelable {
  abstract val payload: String?

  final override fun describeContents() = 0

  final override fun writeToParcel(dest: Parcel, flags: Int) {
    val bundle = Bundle().also { writeToBundle(it) }
    dest.writeBundle(bundle)
  }

  open fun writeToBundle(dest: Bundle) {
    dest.putString(CellStateType.TYPE, type.name)
    dest.putString(CellStateType.PAYLOAD, payload)
  }

  /** Empty state */
  object Blank : CellState(CellStateType.BLANK) {
    override val payload: String? = null
  }

  data class Text(
    override val payload: String,
    @ColorInt val backgroundColor: Int = COLOR_ACCENT
  ) : CellState(CellStateType.TEXT)

  data class Web(override val payload: String) : CellState(CellStateType.WEB) {
    val url get() = payload
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
        CellStateType.TEXT -> Text(
          getString("payload")!!,
          backgroundColor = getColor("backgroundColor") ?: COLOR_ACCENT
        )
        CellStateType.WEB -> Web(
          getString("payload")!!,
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
