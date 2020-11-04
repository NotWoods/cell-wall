package com.tigeroakes.cellwallclient.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.navigation.findNavController
import com.tigeroakes.cellwallclient.NavGraphDirections
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.model.CellState
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONException
import org.json.JSONObject

class MainActivity : AppCompatActivity(R.layout.activity_main) {

  override fun onStart() {
    super.onStart()
    lifecycleScope.launch { updateState(intent) }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    lifecycleScope.launch { updateState(intent) }
  }

  private suspend fun updateState(intent: Intent) {
    val data = intent.data
    if (intent.action == "com.tigeroakes.cellwallclient.DISPLAY" && data != null) {
      val state = try {
        CellState.from(data)
      } catch (err: NullPointerException) {
        CellState.Blank
      }
      updateState(state)
    }
  }

  private suspend fun updateState(state: CellState) {
    val directions = when (state) {
      is CellState.Text -> NavGraphDirections.actionGlobalLargeTextFragment(
        text = state.text,
        background = state.backgroundColor
      )
      else -> NavGraphDirections.actionGlobalSplashFragment()
    }

    findNavController(R.id.nav_host_fragment).navigate(directions)
  }
}
