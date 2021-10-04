package com.tigeroakes.cellwall.client.device

import android.os.Build
import android.util.DisplayMetrics
import java.util.*

/**
 * Returns manufacturer name followed by model name.
 *
 * Example results: Samsung GT-S5830L, HTC Wildfire S A510e
 * @see {https://stackoverflow.com/questions/1995439/get-android-phone-model-programmatically}
 */
fun deviceName(): String {
  val manufacturer = Build.MANUFACTURER
  val model = Build.MODEL
  val modelFormatted = model.replaceFirstChar { it.titlecase(Locale.ROOT) }

  return if (model.startsWith(manufacturer)) {
    modelFormatted
  } else {
    manufacturer.replaceFirstChar { it.titlecase(Locale.ROOT) } + " " + modelFormatted
  }
}

fun serialNo(): String {
  return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
    Build.UNKNOWN
  } else {
    @Suppress("Deprecation", "HardwareIds")
    Build.SERIAL
  }
}

fun getCellInfo(metrics: DisplayMetrics): CellInfo {
  return CellInfo(
    deviceName = deviceName(),
    density = metrics.density,
    widthPixels = metrics.widthPixels,
    heightPixels = metrics.heightPixels
  )
}
