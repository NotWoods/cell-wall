package com.tigeroakes.cellwallclient.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.device.Immersive
import com.tigeroakes.cellwallclient.model.CellState

class MainActivity : AppCompatActivity(R.layout.activity_main) {

  private lateinit var manager: CellStateManager

  override fun onStart() {
    super.onStart()
    manager = CellStateManager(
      navController = findNavController(R.id.nav_host_fragment),
      fragmentManager = supportFragmentManager,
    )

    manager.updateState(intent)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    manager.updateState(intent)
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) Immersive.enterImmersiveMode(window)
  }

  override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)
    outState.putParcelable(CellState.STATE_KEY, manager.currentState)
  }

  override fun onRestoreInstanceState(savedInstanceState: Bundle) {
    super.onRestoreInstanceState(savedInstanceState)
    savedInstanceState.getParcelable<CellState>(CellState.STATE_KEY)?.let { state ->
      manager.updateState(state)
    }
  }
}
