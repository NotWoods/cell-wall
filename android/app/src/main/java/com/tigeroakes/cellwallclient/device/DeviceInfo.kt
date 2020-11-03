package com.tigeroakes.cellwallclient.device

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

  return if (model.startsWith(manufacturer)) {
    model.capitalize(Locale.ROOT)
  } else {
    manufacturer.capitalize(Locale.ROOT) + " " + model.capitalize(Locale.ROOT)
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
    density = metrics.densityDpi,
    widthPixels = metrics.widthPixels,
    heightPixels = metrics.heightPixels
  )
}
