package com.tigeroakes.cellwallclient.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.annotation.IdRes
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavDirections
import androidx.navigation.findNavController
import com.tigeroakes.cellwallclient.NavGraphDirections
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.data.CellWallRepository
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragmentArgs
import com.tigeroakes.cellwallclient.ui.text.LargeTextFragmentDirections
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext

class MainActivity : AppCompatActivity(R.layout.activity_web) {

  override fun onStart() {
    super.onStart()
    lifecycleScope.launch { updateState(intent) }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    lifecycleScope.launch { updateState(intent) }
  }

  private suspend fun updateState(intent: Intent) {
    val repository = CellWallRepository.get(this)
    val stateJson = intent.getStringExtra("EXTRA_STATE")
    val adapter = repository.cellStateAdapter()
    if (intent.action == "com.tigeroakes.cellwallclient.DISPLAY" && stateJson != null) {
      val state = withContext(Dispatchers.IO) { adapter.fromJson(stateJson) }
      state?.let { updateState(state) }
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
