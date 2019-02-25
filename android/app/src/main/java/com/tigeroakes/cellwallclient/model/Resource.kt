package com.tigeroakes.cellwallclient.model

import java.io.Serializable

/**
 * A generic class that contains data and status about loading this data.
 * @see {https://developer.android.com/jetpack/docs/guide#addendum}
 */
class Resource<out T> private constructor(private val value: Any?) : Serializable {
    val isSuccess: Boolean get() = !isFailure && !isLoading

    val isFailure: Boolean get() = value is Failure

    val isLoading: Boolean get() = value is Loading

    @Suppress("UNCHECKED_CAST")
    fun getOrNull(): T? = when {
        isFailure -> null
        isLoading -> null
        else -> value as T
    }

    fun exceptionOrNull(): Throwable? = when (value) {
        is Failure -> value.exception
        else -> null
    }

    fun throwOnFailure() {
        if (value is Failure) throw value.exception
    }

    override fun toString(): String = when (value) {
        is Failure -> value.toString() // "Failure($exception)"
        is Loading -> value.toString() // "Loading()"
        else -> "Success($value)"
    }

    companion object {
        /**
         * Returns an instance that encapsulates the given [value] as successful value.
         */
        fun <T> success(value: T): Resource<T> =
            Resource(value)

        /**
         * Returns an instance that encapsulates the given [exception] as failure.
         */
        fun <T> failure(exception: Throwable): Resource<T> =
            Resource(Failure(exception) as Any)

        fun <T> loading(): Resource<T> =
            Resource(Loading() as Any)
    }

    private data class Failure(
        @JvmField
        val exception: Throwable
    ) : Serializable

    private class Loading : Serializable {
        override fun equals(other: Any?): Boolean = other is Loading
        override fun hashCode(): Int = 7
        override fun toString(): String = "Loading()"
    }
}
