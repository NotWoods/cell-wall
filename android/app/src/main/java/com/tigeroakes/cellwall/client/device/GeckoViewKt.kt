package com.tigeroakes.cellwall.client.device

import org.mozilla.geckoview.ContentBlocking
import org.mozilla.geckoview.GeckoRuntimeSettings

inline fun geckoRuntimeSettings(builder: GeckoRuntimeSettings.Builder.() -> Unit) =
  GeckoRuntimeSettings.Builder().apply(builder).build()

inline fun contentBlockingSettings(builder: ContentBlocking.Settings.Builder.() -> Unit) =
  ContentBlocking.Settings.Builder().apply(builder).build()

inline fun GeckoRuntimeSettings.Builder.contentBlocking(
  builder: ContentBlocking.Settings.Builder.() -> Unit
) = contentBlocking(contentBlockingSettings(builder))
