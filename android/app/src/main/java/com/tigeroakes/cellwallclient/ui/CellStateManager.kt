package com.tigeroakes.cellwallclient.ui

import android.content.Intent
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.navigation.NavController
import com.tigeroakes.cellwallclient.NavGraphDirections
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.ui.web.WebFragment
import java.util.logging.Logger

class CellStateManager(
  private val navController: NavController,
  private val fragmentManager: FragmentManager
) {

  private val logger = Logger.getLogger("CellState")

  var currentState = CellState.Blank
    private set

  fun updateState(intent: Intent) {
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

  fun updateState(state: CellState) {
    logger.info(state.toString())

    if (state is CellState.Web) {
      (fragmentManager.currentNavigationFragment as? WebFragment)?.let { fragment ->
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

  private val FragmentManager.currentNavigationFragment: Fragment?
    get() = primaryNavigationFragment?.childFragmentManager?.fragments?.first()
}
