package com.tigeroakes.cellwallclient.device

import android.content.SharedPreferences
import android.content.res.Resources
import android.os.Build
import com.tigeroakes.cellwallclient.model.CellInfo

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
        model.capitalize()
    } else {
        manufacturer.capitalize() + " " + model.capitalize()
    }
}

fun getCellInfo(resources: Resources, sharedPrefs: SharedPreferences): CellInfo {
    val metrics = resources.displayMetrics
    return CellInfo(
            uuid = Installation.id(sharedPrefs),
            deviceName = deviceName(),
            density = metrics.densityDpi,
            widthPixels = metrics.widthPixels,
            heightPixels = metrics.heightPixels
    )
}
