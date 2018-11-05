package com.tigeroakes.cellwallclient.data.rest

import retrofit2.Call
import retrofit2.Callback
import retrofit2.HttpException
import retrofit2.Response
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

suspend fun <T> Call<T>.await(): T {
    val response = this.awaitResponse()
    if (response.isSuccessful) {
        return response.body() ?: throw NullPointerException("Response body is null: $response")
    } else {
        throw HttpException(response)
    }
}

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
