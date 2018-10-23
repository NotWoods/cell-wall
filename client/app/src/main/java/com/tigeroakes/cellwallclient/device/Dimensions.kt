package com.tigeroakes.cellwallclient.device

import android.content.res.Resources

private const val DIMEN_DEF_TYPE = "dimen"
private const val DIMEN_DEF_PACKAGE = "android"

fun Resources.getSystemDimension(name: String): Int {
    val resourceId = getIdentifier(name, DIMEN_DEF_TYPE, DIMEN_DEF_PACKAGE)
    return if (resourceId > 0) getDimensionPixelSize(resourceId) else 0
}