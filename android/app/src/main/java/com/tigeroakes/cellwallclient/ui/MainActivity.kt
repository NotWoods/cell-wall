package com.tigeroakes.cellwallclient.ui

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.lifecycle.lifecycleScope
import androidx.navigation.NavController
import androidx.navigation.findNavController
import com.tigeroakes.cellwallclient.NavGraphDirections
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.device.Immersive
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.ui.web.WebFragment
import kotlinx.coroutines.launch
import java.util.logging.Logger

class MainActivity : AppCompatActivity(R.layout.activity_main) {

  private lateinit var navController: NavController

  private val logger = Logger.getLogger("CellState")

  private val FragmentManager.currentNavigationFragment: Fragment?
    get() = primaryNavigationFragment?.childFragmentManager?.fragments?.first()

  override fun onStart() {
    super.onStart()
    navController = findNavController(R.id.nav_host_fragment)

    lifecycleScope.launch { updateState(intent) }
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    lifecycleScope.launch { updateState(intent) }
  }

  override fun onWindowFocusChanged(hasFocus: Boolean) {
    super.onWindowFocusChanged(hasFocus)
    if (hasFocus) Immersive.enterImmersiveMode(window)
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
    logger.info(state.toString())

    if (state is CellState.Web) {
      (supportFragmentManager.currentNavigationFragment as? WebFragment)?.let { fragment ->
        fragment.openUrl(state.url)
        return
      }
    }

    val directions = when (state) {
      is CellState.Text -> NavGraphDirections.actionGlobalLargeTextFragment(
        text = state.text,
        background = state.backgroundColor
      )
      is CellState.Web -> NavGraphDirections.actionGlobalWebFragment(
        url = state.url
      )
      else -> NavGraphDirections.actionGlobalSplashFragment()
    }

    navController.navigate(directions)
  }
}
