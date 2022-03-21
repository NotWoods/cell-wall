package com.tigeroakes.cellwall.client.model

import android.net.Uri
import android.os.Bundle
import org.json.JSONObject
import java.util.Locale

enum class CellStateType {
  BLANK,
  CONFIGURE,
  TEXT,
  IMAGE,
  BUTTON,
  WEB;

  companion object {
    const val TYPE = "type"
  }
}

sealed class Container {
  open val type: CellStateType
    get() = getEnum<CellStateType>(CellStateType.TYPE)!!

  abstract fun getString(name: String): String?

  inline fun <reified T : Enum<T>> getEnum(name: String): T? =
    getString(name)?.uppercase(Locale.ROOT)?.let { enumValueOf<T>(it) }
}

class JsonContainer(private val obj: JSONObject) : Container() {
  override fun getString(name: String): String? =
    if (obj.isNull(name)) null else obj.getString(name)
}

class DataUriContainer(private val uri: Uri) : Container() {
  override val type: CellStateType
    get() = CellStateType.valueOf(uri.host!!.uppercase(Locale.ROOT))
  override fun getString(name: String) =
    uri.getQueryParameter(name)
}

class BundleContainer(private val bundle: Bundle) : Container() {
  override fun getString(name: String) =
    bundle.getString(name)
}
