package com.tigeroakes.cellwall.client.check

import android.view.View
import androidx.navigation.NavController
import androidx.navigation.findNavController
import androidx.test.espresso.NoMatchingViewException
import androidx.test.espresso.ViewAssertion
import junit.framework.AssertionFailedError

abstract class NavControllerAssertion : ViewAssertion {

  @Throws(AssertionFailedError::class)
  abstract fun check(controller: NavController)

  final override fun check(view: View?, noViewFoundException: NoMatchingViewException?) {
    if (view == null) {
      throw AssertionFailedError("View is null")
    }

    val controller = try {
      view.findNavController()
    } catch (e: IllegalStateException) {
      throw AssertionFailedError(e.message)
    }

    check(controller)
  }
}
