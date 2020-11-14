package com.tigeroakes.cellwall.client.model

/**
 * A generic class that contains data and status about loading this data.
 * @see {https://developer.android.com/jetpack/docs/guide#addendum}
 */
sealed class Resource<T> {
  abstract val data: T?

  data class Success<T>(override val data: T) : Resource<T>()

  data class Error<T>(val message: String, override val data: T? = null) : Resource<T>()

  data class Loading<T>(override val data: T? = null) : Resource<T>()
}
