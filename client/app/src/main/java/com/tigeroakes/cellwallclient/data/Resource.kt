package com.tigeroakes.cellwallclient.data

/**
 * A generic class that contains data and status about loading this data.
 * @see {https://developer.android.com/jetpack/docs/guide#addendum}
 */
class Resource<T> private constructor(val status: Status, val data: T?, val message: String? = null) {
    companion object {
        fun <T>success(data: T): Resource<T> = Resource(Status.SUCCESS, data)

        fun <T>error(msg: String, data: T?): Resource<T> = Resource(Status.ERROR, data, msg)

        fun <T>loading(data: T?): Resource<T> = Resource(Status.LOADING, data)
    }

    enum class Status { SUCCESS, ERROR, LOADING }
}