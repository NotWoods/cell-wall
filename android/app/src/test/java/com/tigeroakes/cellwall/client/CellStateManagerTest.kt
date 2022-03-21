package com.tigeroakes.cellwall.client

import androidx.fragment.app.FragmentManager
import androidx.navigation.NavController
import androidx.navigation.NavDirections
import androidx.navigation.NavOptions
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.tigeroakes.cellwall.client.model.CellState
import com.tigeroakes.cellwall.client.ui.CellStateManager
import com.tigeroakes.cellwall.client.ui.web.WebFragment
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.verify
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class CellStateManagerTest {

  private lateinit var navController: NavController
  private lateinit var fragmentManager: FragmentManager
  private lateinit var manager: CellStateManager

  @Before
  fun setup() {
    navController = mockk {
      every { navigate(any<NavDirections>(), any<NavOptions>()) } just Runs
    }
    fragmentManager = mockk()
    manager = CellStateManager(navController, fragmentManager)
  }

  @Test
  fun changeWebPage() {
    val webFragment = mockk<WebFragment> {
      every { openUrl(any()) } just Runs
    }
    every {
      fragmentManager.primaryNavigationFragment?.childFragmentManager?.fragments
    } returns listOf(webFragment)

    manager.updateState(CellState.Web("https://example.com"))

    verify { webFragment.openUrl("https://example.com") }
    verify(exactly = 0) { navController.navigate(any<NavDirections>(), any<NavOptions>()) }
  }
}
