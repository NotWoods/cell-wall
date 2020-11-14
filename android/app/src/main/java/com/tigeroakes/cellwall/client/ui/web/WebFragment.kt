package com.tigeroakes.cellwall.client.ui.web

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.R
import kotlinx.android.synthetic.main.fragment_web.*

class WebFragment : Fragment(R.layout.fragment_web) {

  private lateinit var controller: WebViewController
  private val args by navArgs<WebFragmentArgs>()

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    controller = WebViewController(web_view)
  }

  override fun onStart() {
    super.onStart()
    openUrl(args.url)
  }

  fun openUrl(url: String) {
    controller.openUrl(url)
  }
}
