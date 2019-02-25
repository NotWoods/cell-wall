package com.tigeroakes.cellwallclient.data.rest

import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.model.Resource
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

/**
 * @see {https://medium.com/@alvaro.blanco/playing-with-android-architecture-components-retrofit-part-1-9994d651cf3c}
 */
class RetrofitLiveData<T>(
        private val call: Call<T>
) : LiveData<Resource<T>>(), Callback<T> {
    init {
        value = Resource.loading()
    }

    override fun onActive() {
        if (!call.isCanceled && !call.isExecuted) {
            call.enqueue(this)
        }
    }

    override fun onFailure(call: Call<T>, t: Throwable) {
        postValue(Resource.failure(t))
    }

    override fun onResponse(call: Call<T>, response: Response<T>) {
        postValue(Resource.success(response.body()!!))
    }

    fun cancel() {
        if (!call.isCanceled) {
            call.cancel()
        }
    }
}
