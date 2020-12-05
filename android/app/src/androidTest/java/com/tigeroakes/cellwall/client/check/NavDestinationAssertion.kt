package com.tigeroakes.cellwall.client.check

import android.os.Bundle
import android.view.View
import androidx.annotation.IdRes
import androidx.navigation.NavController
import androidx.navigation.NavDestination
import androidx.navigation.findNavController
import androidx.test.espresso.NoMatchingViewException
import androidx.test.espresso.ViewAssertion
import junit.framework.AssertionFailedError

class NavDestinationAssertion(
  @IdRes private val destinationId: Int,
  private val arguments: Bundle?
) : NavControllerAssertion() {

  override fun check(controller: NavController) {
    val entry = controller.currentBackStackEntry ?: throw AssertionFailedError("currentBackStackEntry is null")

    if (entry.destination.id != destinationId) {
      throw AssertionFailedError("${entry.destination} does not match ID $destinationId")
    }

    if (arguments != null) {
      val args = entry.arguments ?: throw AssertionFailedError("Missing arguments in $entry")
      for (key in arguments.keySet()) {
        if (arguments.get(key) != args.get(key)) {
          throw AssertionFailedError("${args.get(key)} does not match ${arguments.get(key)} under $key")
        }
      }
    }
  }
}

fun goesTo(@IdRes destinationId: Int, arguments: Bundle? = null) =
  NavDestinationAssertion(destinationId, arguments)
