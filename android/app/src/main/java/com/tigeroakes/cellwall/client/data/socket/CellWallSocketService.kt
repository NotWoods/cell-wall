package com.tigeroakes.cellwall.client.data.socket

import com.tinder.scarlet.ws.Receive
import kotlinx.coroutines.channels.ReceiveChannel
import org.json.JSONObject

interface CellWallSocketService {
  @Receive
  fun observeState(): ReceiveChannel<JSONObject>
}