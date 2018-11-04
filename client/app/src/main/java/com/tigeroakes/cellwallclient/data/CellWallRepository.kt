package com.tigeroakes.cellwallclient.data

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.tigeroakes.cellwallclient.data.rest.*
import com.tigeroakes.cellwallclient.data.socket.StateLiveData
import com.tigeroakes.cellwallclient.model.*
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.net.URI
import java.util.*

/**
 * This repository handles data operations related to the CellWall.
 * It provides a clean API so that the rest of the app can retrieve this data easily.
 * It knows where to get the data from and what API calls to make when data is updated.
 * You can consider it to be a mediator between different data sources,
 * such as web services, sockets, and caches.
 */
object CellWallRepository {
    private var serverAddress: URI = URI("")
    private val webservice = ServiceGenerator.createService(Webservice::class.java)

    /**
     * Validate the given URL
     */
    fun attemptLogin(address: String, getString: (Int) -> String): LiveData<Resource<URI>> {
        val result = MutableLiveData<Resource<URI>>()
        val url: URI
        try {
            url = guessUri(address)
            ServiceGenerator.apiBaseUrl = url.toString()
        } catch (err: ServerUrlValidationException) {
            val reason = getString(err.reason.stringRes)
            result.value = Resource.error(reason, null)
            return result
        }

        result.value = Resource.loading(null)
        webservice.isCellWall().enqueue(object : Callback<Unit> {
            override fun onResponse(call: Call<Unit>, response: Response<Unit>) {
                result.postValue(if (response.isSuccessful) {
                    serverAddress = url
                    Resource.success(url)
                } else {
                    val errReason = Reason.PATH_RETURNED_ERROR
                    Resource.error(getString(errReason.stringRes), null as URI?)
                })
            }

            override fun onFailure(call: Call<Unit>, t: Throwable) {
                val errReason = Reason.PATH_DOES_NOT_EXIST
                result.postValue(Resource.error(getString(errReason.stringRes), null as URI?))
            }
        })
        return result
    }

    /**
     * Register this device to the Wall.
     */
    fun register(
            uuid: UUID,
            deviceName: String,
            density: Int,
            widthPixels: Int,
            heightPixels: Int
    ): LiveData<Resource<Unit>> {
        return RetrofitLiveData(webservice.putCell(
                uuid,
                RegisterCellRequest(deviceName, density, widthPixels, heightPixels)
        ))
    }

    /**
     * Get the current state of this Cell.
     */
    fun getState(): LiveData<CellState> = StateLiveData().also { it.setAddress(serverAddress) }

    /**
     * Get a list of possible actions for the user to trigger.
     */
    fun listActions(): LiveData<Resource<List<Action>>> = RetrofitLiveData(webservice.getActions())

    /**
     * Trigger a specific action
     */
    fun triggerAction(action: Action): LiveData<Resource<Unit>> {
        return RetrofitLiveData(webservice.postAction(ActionRequest(action.id)))
    }

    /**
     * Inform the wall that the user touched a button on screen.
     */
    fun sendButtonTouch() {
        // TODO
    }

    /**
     * Prepend the server address to an image URL.
     * No effect if the src doesn't start with "/".
     */
    fun addImageHost(imageSrc: String): URI {
        val path = imageSrc.removePrefix("/")
        val startsWithSlash = path != imageSrc
        return if (startsWithSlash) {
            serverAddress.resolve(path)
        } else {
            URI(imageSrc)
        }
    }
}