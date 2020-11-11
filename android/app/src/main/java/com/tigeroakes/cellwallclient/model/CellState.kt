package com.tigeroakes.cellwallclient.model

import android.graphics.Color
import android.net.Uri
import android.os.Parcel
import android.os.Parcelable
import androidx.annotation.ColorInt
import kotlinx.android.parcel.Parcelize
import org.json.JSONObject
import java.util.*

enum class CellStateType {
  BLANK,
  CONFIGURE,
  TEXT,
  IMAGE,
  BUTTON,
  WEB,
}

/**
 * Enum representing different modes for a Cell, along with its associated data.
 */
sealed class CellState(val type: CellStateType) : Parcelable {
  override fun describeContents() = 0

  override fun writeToParcel(dest: Parcel, flags: Int) {
    dest.writeString(type.name)
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
    override fun writeToParcel(dest: Parcel, flags: Int) {
      super.writeToParcel(dest, flags)
      dest.writeString(icon)
      dest.writeInt(backgroundColor)
    }
  }

  data class Text(
    val text: String,
    @ColorInt val backgroundColor: Int
  ) : CellState(CellStateType.TEXT) {
    override fun writeToParcel(dest: Parcel, flags: Int) {
      super.writeToParcel(dest, flags)
      dest.writeString(text)
      dest.writeInt(backgroundColor)
    }
  }

  data class Image(
    val src: String,
    val scaleType: String
  ) : CellState(CellStateType.IMAGE) {
    override fun writeToParcel(dest: Parcel, flags: Int) {
      super.writeToParcel(dest, flags)
      dest.writeString(src)
      dest.writeString(scaleType)
    }
  }

  data class Button(@ColorInt val backgroundColor: Int) : CellState(CellStateType.BUTTON) {
    override fun writeToParcel(dest: Parcel, flags: Int) {
      super.writeToParcel(dest, flags)
      dest.writeInt(backgroundColor)
    }
  }

  data class Web(val url: String) : CellState(CellStateType.WEB) {
    override fun writeToParcel(dest: Parcel, flags: Int) {
      super.writeToParcel(dest, flags)
      dest.writeString(url)
    }
  }

  companion object {
    const val STATE_KEY = "state"

    @JvmStatic
    val CREATOR: Parcelable.Creator<CellState> = object : Parcelable.Creator<CellState> {
      override fun createFromParcel(source: Parcel): CellState = when (source.readString()) {
        CellStateType.CONFIGURE.name -> Configure(
          icon = source.readString()!!,
          backgroundColor = source.readInt(),
        )
        CellStateType.TEXT.name -> Text(
          text = source.readString()!!,
          backgroundColor = source.readInt(),
        )
        CellStateType.IMAGE.name -> Image(
          src = source.readString()!!,
          scaleType = source.readString()!!
        )
        CellStateType.BUTTON.name -> Button(source.readInt())
        CellStateType.WEB.name -> Web(source.readString()!!)
        else -> Blank
      }

      override fun newArray(size: Int): Array<CellState?> = arrayOfNulls(size)
    }

    private fun JSONObject.getColor(name: String) = Color.parseColor(getString(name))
    private fun Uri.getColor(name: String) = Color.parseColor(getQueryParameter(name))

    /**
     * Return the CellState object corresponding to the given mode.
     * CellState fields are populated using the provided JSON data.
     */
    fun from(json: JSONObject): CellState = json.run {
      when (json.getString("type")) {
        CellStateType.CONFIGURE.name -> Configure(
          icon = getString("icon"),
          backgroundColor = getColor("backgroundColor"),
        )
        CellStateType.TEXT.name -> Text(
          text = getString("text"),
          backgroundColor = getColor("backgroundColor"),
        )
        CellStateType.IMAGE.name -> Image(
          src = getString("src"),
          scaleType = getString("scaleType")
        )
        CellStateType.BUTTON.name -> Button(getColor("backgroundColor"))
        CellStateType.WEB.name -> Web(getString("url"))
        else -> Blank
      }
    }

    fun from(uri: Uri): CellState = when (uri.scheme) {
      "http", "https" -> Web(uri.toString())
      "cellwall" -> {
        val type = uri.host?.toUpperCase(Locale.ROOT)
        uri.run {
          when (type) {
            CellStateType.CONFIGURE.name -> Configure(
              icon = getQueryParameter("icon")!!,
              backgroundColor = getColor("backgroundColor"),
            )
            CellStateType.TEXT.name -> Text(
              text = getQueryParameter("text")!!,
              backgroundColor = getColor("backgroundColor"),
            )
            CellStateType.IMAGE.name -> Image(
              src = getQueryParameter("src")!!,
              scaleType = getQueryParameter("scaleType")!!
            )
            CellStateType.BUTTON.name -> Button(getColor("backgroundColor"))
            else -> Blank
          }
        }
      }
      else -> Blank
    }
  }
}
