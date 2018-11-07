package com.tigeroakes.cellwallclient.data

import android.content.SharedPreferences
import androidx.lifecycle.LiveData
import com.tigeroakes.cellwallclient.data.rest.*
import com.tigeroakes.cellwallclient.data.socket.StateLiveData
import com.tigeroakes.cellwallclient.device.Installation
import com.tigeroakes.cellwallclient.model.*
import java.net.URI
import java.util.*

interface CellWallRepository {
    val id: UUID
    val isUrlSaved: Boolean

    /**
     * Validate the given URL.
     * @param address URL to try connecting to.
     */
    suspend fun attemptToConnect(address: String): URI

    /**
     * Register this device to the Wall.
     */
    suspend fun register(info: CellInfo)

    /**
     * Get the current state of this Cell.
     */
    fun getState(): LiveData<CellState>

    /**
     * Get a list of possible actions for the user to trigger.
     */
    fun listActions(): LiveData<Resource<List<Action>>>

    /**
     * Trigger a specific action
     */
    suspend fun triggerAction(action: Action)

    /**
     * Inform the wall that the user touched a button on screen.
     */
    fun sendButtonTouch()

    /**
     * Prepend the server address to an image URL.
     * No effect if the src doesn't start with "/".
     */
    fun addImageHost(imageSrc: String): URI
}

/**
 * This repository handles data operations related to the CellWall.
 * It provides a clean API so that the rest of the app can retrieve this data easily.
 * It knows where to get the data from and what API calls to make when data is updated.
 * You can consider it to be a mediator between different data sources,
 * such as web services, sockets, and caches.
 */
class CellWallRepositoryImpl private constructor(
        sharedPrefs: SharedPreferences
) : CellWallRepository {
    private val prefs = PreferenceManager(sharedPrefs)
    private val webservice = ServiceGenerator.createService(Webservice::class.java)
    private var serverAddress: URI? = prefs.serverAddress?.let { URI(it) }

    override val id: UUID
        get() = Installation.id(prefs)

    override val isUrlSaved: Boolean
        get() = serverAddress != null

    override suspend fun attemptToConnect(address: String): URI {
        val lastUrl = ServiceGenerator.apiBaseUrl

        val url = ServerUrlValidator.guessUri(address)
        ServiceGenerator.apiBaseUrl = url
        val res = try {
            webservice.isCellWall().awaitResponse()
        } catch (err: Throwable) {
            ServiceGenerator.apiBaseUrl = lastUrl
            throw ServerUrlValidator.ValidationException(Reason.PATH_DOES_NOT_EXIST)
        }

        if (res.isSuccessful) {
            serverAddress = url
            prefs.serverAddress = url.toString()
            return url
        } else {
            ServiceGenerator.apiBaseUrl = lastUrl
            throw ServerUrlValidator.ValidationException(Reason.PATH_RETURNED_ERROR)
        }
    }

    override suspend fun register(info: CellInfo) {
        val res = webservice.putCell(id, info).awaitResponse()
    }

    override fun getState(): LiveData<CellState> = StateLiveData().also { state ->
        serverAddress?.let { state.setAddress(it) }
    }

    override fun listActions(): LiveData<Resource<List<Action>>> =
            webservice.getActions().toLiveData()

    override suspend fun triggerAction(action: Action) {
        val res = webservice.postAction(ActionRequest(action.id)).awaitResponse()
    }

    override fun sendButtonTouch() {
        // TODO
    }

    override fun addImageHost(imageSrc: String): URI {
        val path = imageSrc.removePrefix("/")
        val startsWithSlash = path != imageSrc
        return if (startsWithSlash) {
            serverAddress!!.resolve(path)
        } else {
            URI(imageSrc)
        }
    }

    companion object {
        @Volatile private var instance: CellWallRepository? = null

        fun getInstance(sharedPrefs: SharedPreferences) =
                instance ?: synchronized(this) {
                    instance ?: CellWallRepositoryImpl(sharedPrefs).also { instance = it }
                }
    }
}