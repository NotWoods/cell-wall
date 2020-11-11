package com.tigeroakes.cellwallclient.data.prefs

import android.content.Context
import android.os.Build
import com.tfcporciuncula.flow.FlowSharedPreferences
import kotlinx.coroutines.ExperimentalCoroutinesApi

@OptIn(ExperimentalCoroutinesApi::class)
class Settings(context: Context) {
  private val prefs = FlowSharedPreferences(context.getSharedPreferences("settings", Context.MODE_PRIVATE))

  val serverAddress = prefs.getString("serverAddress")
  val serial = prefs.getString("serial", defaultValue = Build.UNKNOWN)
}
