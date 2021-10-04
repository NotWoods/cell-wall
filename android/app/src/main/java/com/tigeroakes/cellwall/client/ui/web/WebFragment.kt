package com.tigeroakes.cellwall.client.ui.web

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.activity.result.contract.ActivityResultContracts.RequestMultiplePermissions
import androidx.fragment.app.activityViewModels
import androidx.navigation.fragment.navArgs
import com.tigeroakes.cellwall.client.databinding.FragmentWebBinding
import com.tigeroakes.cellwall.client.ui.ViewBindingFragment

class WebFragment : ViewBindingFragment<FragmentWebBinding>() {

  private val args by navArgs<WebFragmentArgs>()
  private val viewModel by activityViewModels<WebViewModel>()

  private val requestPermissions = registerForActivityResult(RequestMultiplePermissions()) { grantResults ->
    viewModel.onRequestPermissionsResult(grantResults)
  }

  override fun inflateLayout(
    inflater: LayoutInflater, container: ViewGroup?
  ) = FragmentWebBinding.inflate(inflater, container, false)

  override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    binding!!.webView.setSession(viewModel.session)

    viewModel.permissionRequests.observe(viewLifecycleOwner) { event ->
      event.getContentIfNotHandled()?.let { permissions ->
        requestPermissions.launch(permissions)
      }
    }
  }

  override fun onStart() {
    super.onStart()
    openUrl(args.url)
  }

  fun openUrl(url: String) {
    viewModel.openUrl(url)
  }
}
