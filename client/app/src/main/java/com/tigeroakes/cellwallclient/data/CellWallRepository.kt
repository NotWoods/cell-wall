package com.tigeroakes.cellwallclient.data

import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.data.rest.ServiceGenerator
import com.tigeroakes.cellwallclient.data.rest.Webservice
import com.tigeroakes.cellwallclient.data.rest.toLiveData
import com.tigeroakes.cellwallclient.data.socket.StateLiveData
import com.tigeroakes.cellwallclient.model.*
import java.net.URI

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
    private val validator = ServiceGenerator.createValidator()

    /**
     * Validate the given URL.
     * @param address URL to try connecting to.
     */
    suspend fun attemptToConnect(address: String): URI {
        val url = validator.validate(address)
        ServiceGenerator.apiBaseUrl = url.toString()
        serverAddress = url
        return url
    }

    /**
     * Register this device to the Wall.
     */
    fun register(info: CellInfo): LiveData<Resource<Unit>> {
        return webservice.putCell(info.uuid, info).toLiveData()
    }

    /**
     * Get the current state of this Cell.
     */
    fun getState(): LiveData<CellState> = StateLiveData().also { it.setAddress(serverAddress) }

    /**
     * Get a list of possible actions for the user to trigger.
     */
    fun listActions(): LiveData<Resource<List<Action>>> = webservice.getActions().toLiveData()

    /**
     * Trigger a specific action
     */
    fun triggerAction(action: Action): LiveData<Resource<Unit>> {
        return webservice.postAction(ActionRequest(action.id)).toLiveData()
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