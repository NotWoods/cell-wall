package com.tigeroakes.cellwall.client.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.viewbinding.ViewBinding

abstract class ViewBindingFragment<VB : ViewBinding> : Fragment() {

  protected var binding: VB? = null

  override fun onCreateView(
    inflater: LayoutInflater,
    container: ViewGroup?,
    savedInstanceState: Bundle?
  ): View? {
    val binding = inflateLayout(layoutInflater, container)
    this.binding = binding
    return binding.root
  }

  override fun onDestroyView() {
    super.onDestroyView()
    binding = null
  }

  protected abstract fun inflateLayout(inflater: LayoutInflater, container: ViewGroup?): VB
}
