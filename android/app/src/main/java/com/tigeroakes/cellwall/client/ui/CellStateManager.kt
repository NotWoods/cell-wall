package com.tigeroakes.cellwall.client.ui

import android.content.Intent
import androidx.fragment.app.Fragment
import androidx.fragment.app.FragmentManager
import androidx.navigation.NavController
import androidx.navigation.NavOptions
import androidx.navigation.NavOptionsBuilder
import androidx.navigation.navOptions
import com.tigeroakes.cellwall.client.NavGraphDirections
import com.tigeroakes.cellwall.client.model.CellState
import com.tigeroakes.cellwall.client.ui.web.WebFragment
import com.tigeroakes.cellwall.client.ui.web.WebViewModel
import java.util.logging.Logger

class CellStateManager(
  private val navController: NavController,
  private val fragmentManager: FragmentManager,
) {

  private val logger = Logger.getLogger("CellState")

  var currentState = CellState.Blank
    private set

  fun updateState(intent: Intent) {
    val data = intent.data
    if (intent.action == "com.tigeroakes.cellwall.client.DISPLAY" && data != null) {
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
        backgroundColor = state.backgroundColor
      )
      is CellState.Image -> NavGraphDirections.actionGlobalImageFragment(
        src = state.src,
        scaleType = state.scaleType.name
      )
      is CellState.Web -> NavGraphDirections.actionGlobalWebFragment(
        url = state.url
      )
      else -> NavGraphDirections.actionGlobalSplashFragment()
    }

    navController.navigate(directions, navOptions {
      anim {
        val animation = SlideAnimation.randomEdge()
        enter = animation.enterResId
        exit = animation.exitResId
      }
    })
  }

  private val FragmentManager.currentNavigationFragment: Fragment?
    get() = primaryNavigationFragment?.childFragmentManager?.fragments?.first()
}
