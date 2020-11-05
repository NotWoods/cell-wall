package com.tigeroakes.cellwallclient.ui.web

import android.os.Bundle
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.fragment_web.*

class WebFragment : Fragment(R.layout.fragment_web) {

  private lateinit var controller: WebViewController
  private val args by navArgs<WebFragmentArgs>()

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    controller = WebViewController(web_view)
    openUrl(args.url)
  }

  fun openUrl(url: String) {
    controller.openUrl(url)
  }
}
