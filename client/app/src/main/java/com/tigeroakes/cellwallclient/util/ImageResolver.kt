package com.tigeroakes.cellwallclient.util

import android.content.SharedPreferences
import android.net.Uri
import androidx.core.net.toUri
import com.tigeroakes.cellwallclient.SERVER_ADDRESS_KEY

fun getImageUri(sharedPrefs: SharedPreferences, imageSrc: String?): Uri? {
    if (imageSrc == null) return null

    return if (imageSrc.startsWith("/")) {
        val serverAddress = sharedPrefs.getString(SERVER_ADDRESS_KEY, null)!!.toUri()
        serverAddress.buildUpon().appendPath(imageSrc).build()
    } else {
        imageSrc.toUri()
    }
}