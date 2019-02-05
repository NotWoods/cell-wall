package com.tigeroakes.cellwallclient.data.rest

import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.io.IOException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

/**
 * Extension functions for Retrofit Calls.
 */

/**
 * Convert to RetrofitLiveData
 */
fun <T> Call<T>.toLiveData() = RetrofitLiveData(this)

suspend fun <T> Call<T>.awaitResponse(): Response<T> = suspendCoroutine { continuation ->
    this.enqueue(object : Callback<T> {
        override fun onResponse(call: Call<T>, response: Response<T>) {
            continuation.resume(response)
        }

        override fun onFailure(call: Call<T>, t: Throwable) {
            continuation.resumeWithException(t)
        }
    })
}

suspend fun okhttp3.Call.awaitResponse(): okhttp3.Response = suspendCoroutine { continuation ->
    this.enqueue(object : okhttp3.Callback {
        override fun onResponse(call: okhttp3.Call, response: okhttp3.Response) {
            continuation.resume(response)
        }

        override fun onFailure(call: okhttp3.Call, e: IOException) {
            continuation.resumeWithException(e)
        }
    })
}
