package com.tigeroakes.cellwallclient.data

import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import com.tigeroakes.cellwallclient.model.Action
import com.tigeroakes.cellwallclient.model.ActionRequest
import com.tigeroakes.cellwallclient.model.CellState
import com.tigeroakes.cellwallclient.model.RegisterCellRequest
import retrofit2.Response
import java.util.*

/**
 * This repository handles data operations related to the CellWall.
 * It provides a clean API so that the rest of the app can retrieve this data easily.
 * It knows where to get the data from and what API calls to make when data is updated.
 * You can consider it to be a mediator between different data sources,
 * such as web services, sockets, and caches.
 */
class CellWallRepostiory(private val uuid: UUID) {
    private lateinit var webservice: Webservice

    /**
     * Register this device to the Wall.
     */
    fun register(
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
    fun getState(): LiveData<Resource<CellState>> {
        // Use socket if available
        return RetrofitLiveData(webservice.getState(uuid))
    }

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
}