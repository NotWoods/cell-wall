package com.tigeroakes.cellwallclient.ui.login

import android.animation.Animator
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.os.PersistableBundle
import android.view.ViewPropertyAnimator
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isGone
import androidx.core.view.isInvisible
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.device.getCellInfo
import com.tigeroakes.cellwallclient.device.serialNo
import com.tigeroakes.cellwallclient.ui.MainActivity
import kotlinx.android.synthetic.main.activity_login.*
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
    val systemSerial = serialNo()
    if (intentSerial != null) {
      serial.setText(intentSerial)
    } else if (systemSerial != Build.UNKNOWN) {
      serial.setText(systemSerial)
    }
  }

  /** Update the debug text */
  private fun setupDebugText() {
    val info = getCellInfo(resources.displayMetrics)
    debug_device_name.text = getString(R.string.debug_device_name, info.deviceName)
    debug_density.text = getString(R.string.debug_density, info.density)
    debug_display.text = getString(R.string.debug_display, info.widthPixels, info.heightPixels)
  }

  /**
   * Add a listener to this ViewPropertyAnimator using the provided actions.
   * Based on Android KTX Animator.addListener function.
   */
  private inline fun ViewPropertyAnimator.setListener(
    crossinline onEnd: (animator: Animator) -> Unit = {},
    crossinline onStart: (animator: Animator) -> Unit = {},
    crossinline onCancel: (animator: Animator) -> Unit = {},
    crossinline onRepeat: (animator: Animator) -> Unit = {}
  ): ViewPropertyAnimator {
    val listener = object : Animator.AnimatorListener {
      override fun onAnimationRepeat(animator: Animator) = onRepeat(animator)
      override fun onAnimationEnd(animator: Animator) = onEnd(animator)
      override fun onAnimationCancel(animator: Animator) = onCancel(animator)
      override fun onAnimationStart(animator: Animator) = onStart(animator)
    }
    return setListener(listener)
  }

  companion object {
    const val EXTRA_SERIAL = "EXTRA_SERIAL"
  }
}
