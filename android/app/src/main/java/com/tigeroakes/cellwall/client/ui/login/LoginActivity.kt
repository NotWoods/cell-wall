package com.tigeroakes.cellwall.client.ui.login

import android.content.Intent
import android.os.Build
import androidx.activity.viewModels
import androidx.annotation.Keep
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isInvisible
import androidx.lifecycle.lifecycleScope
import com.tigeroakes.cellwall.client.R
import com.tigeroakes.cellwall.client.device.getCellInfo
import com.tigeroakes.cellwall.client.device.serialNo
import com.tigeroakes.cellwall.client.ui.MainActivity
import kotlinx.android.synthetic.main.activity_login.*
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class LoginActivity : AppCompatActivity(R.layout.activity_login) {

  private val viewModel by viewModels<LoginViewModel>()

  override fun onStart() {
    super.onStart()

    setupLoadingBar()
    setupAddressInput()
    setupSerialNoInput()
    setupDebugText()

    exit_button.setOnClickListener {
      val intent = Intent(this, MainActivity::class.java)
      startActivity(intent)
    }
  }

  /**
   * Attempts to connect to the server specified by the login form.
   */
  private suspend fun attemptLogin() {
    viewModel.attemptLogin(
      address.text.toString(),
      serial.text.toString(),
      getCellInfo(resources.displayMetrics),
    )
  }

  private fun setupLoadingBar() {
    viewModel.isLoading.observe(this) {
      // Show the loading bar when communicating with the server.
      login_progress.isInvisible = !it
    }
  }

  private fun setupAddressInput() {
    val intentAddress = intent.data
    if (intentAddress != null) {
      // http://192.168.50.252:2015
      address.setText(intentAddress.toString())
    } else {
      lifecycleScope.launch {
        val defaultValue = viewModel.serverAddressSetting.first()
        address.setText(defaultValue)
      }
    }

    // Login when the connect button is pressed
    connect_button.setOnClickListener {
      lifecycleScope.launch { attemptLogin() }
    }

    viewModel.errorResource.observe(this) {
      // Show error, if any.
      address_container.error = it.peekContent()?.let(this::getString)

      // When error updates and is not-null, focus on the address input.
      it.getContentIfNotHandled()?.let {
        address.requestFocus()
      }
    }
  }

  private fun setupSerialNoInput() {
    val intentSerial = intent.extras?.getString(EXTRA_SERIAL)
    lifecycleScope.launch {
      val serialText = intentSerial
        ?: serialNo().takeIf(::notUnknown)
        ?: viewModel.serialSetting.first().takeIf(::notUnknown)
      serial.setText(serialText)
    }
  }

  private fun notUnknown(serial: String) = serial != Build.UNKNOWN

  /** Update the debug text */
  private fun setupDebugText() {
    val info = getCellInfo(resources.displayMetrics)
    debug_device_name.text = getString(R.string.debug_device_name, info.deviceName)
    debug_density.text = getString(R.string.debug_density, info.density)
    debug_display.text = getString(R.string.debug_display, info.widthPixels, info.heightPixels)
  }

  companion object {
    const val EXTRA_SERIAL = "EXTRA_SERIAL"
  }
}
