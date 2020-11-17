package com.tigeroakes.cellwall.client.ui

import android.content.Intent
import android.os.Bundle
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.findNavController
import com.tigeroakes.cellwall.client.R
import com.tigeroakes.cellwall.client.device.Immersive
import com.tigeroakes.cellwall.client.model.CellState
import com.tigeroakes.cellwall.client.ui.web.WebViewModel

class MainActivity : AppCompatActivity(R.layout.activity_main) {

  private lateinit var manager: CellStateManager

  override fun onStart() {
    super.onStart()
    manager = CellStateManager(
      navController = findNavController(R.id.nav_host_fragment),
      fragmentManager = supportFragmentManager,
    )
  }

  override fun onPostCreate(savedInstanceState: Bundle?) {
    super.onPostCreate(savedInstanceState)

    val oldState = savedInstanceState?.getParcelable<CellState>(CellState.STATE_KEY)
    if (oldState != null) {
      manager.updateState(oldState)
    } else {
      manager.updateState(intent)
    }
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
}
