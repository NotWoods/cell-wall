package com.tigeroakes.cellwallclient

import android.view.MotionEvent
import android.view.View
import com.tigeroakes.cellwallclient.socket.BoundSocket

class TouchEmitter(private val socket: BoundSocket): View.OnTouchListener {
    override fun onTouch(v: View, event: MotionEvent): Boolean {
        if (event.action == MotionEvent.ACTION_UP) {
            socket.emit("touch", event.rawX, event.rawY, event.action)
            v.performClick()
        }
        return true
    }
}