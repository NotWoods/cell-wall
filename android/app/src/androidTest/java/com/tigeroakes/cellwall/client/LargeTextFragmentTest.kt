package com.tigeroakes.cellwall.client

import android.content.Intent
import android.graphics.Color
import androidx.core.net.toUri
import androidx.core.os.bundleOf
import androidx.test.core.app.launchActivity
import androidx.test.espresso.Espresso.onView
import androidx.test.espresso.matcher.ViewMatchers.withId
import com.tigeroakes.cellwall.client.check.goesTo
import com.tigeroakes.cellwall.client.ui.CellStateManager.Companion.ACTION_DISPLAY
import com.tigeroakes.cellwall.client.ui.MainActivity
import com.tigeroakes.cellwall.client.ui.text.LargeTextFragmentArgs
import org.junit.Test

class LargeTextFragmentTest {

  @Test
  fun testText() {
    val intent = Intent(ACTION_DISPLAY, "cellwall://text?text=Hello+world".toUri())
    launchActivity<MainActivity>(intent)
    onView(withId(R.id.nav_host_fragment)).check(goesTo(
      R.id.largeTextFragment,
      bundleOf("text" to "Hello world", "backgroundColor" to Color.BLACK)
    ))
  }
}
