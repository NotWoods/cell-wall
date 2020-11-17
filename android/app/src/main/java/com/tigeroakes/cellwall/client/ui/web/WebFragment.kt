package com.tigeroakes.cellwall.client.ui.web

import android.os.Bundle
import android.view.View
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.R
import kotlinx.android.synthetic.main.fragment_web.*

class WebFragment : Fragment(R.layout.fragment_web) {

  private val args by navArgs<WebFragmentArgs>()
  private val viewModel by activityViewModels<WebViewModel>()

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    web_view.setSession(viewModel.session)
  }

  override fun onStart() {
    super.onStart()
    openUrl(args.url)
  }

  fun openUrl(url: String) {
    viewModel.openUrl(url)
  }
}
