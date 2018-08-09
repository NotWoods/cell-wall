package com.tigeroakes.cellwallclient.cells

import android.content.Context
import android.net.Uri
import android.os.Bundle
import android.preference.PreferenceManager.getDefaultSharedPreferences
import androidx.fragment.app.Fragment
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup

import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.SocketManager.getSocket
import com.tigeroakes.cellwallclient.SocketManager.emitTouch
import io.socket.client.Socket
import kotlinx.android.synthetic.main.fragment_large_text.*

private const val ARG_TEXT = "text"

/**
 * A simple [Fragment] subclass.
 * Use the [LargeTextFragment.newInstance] factory method to
 * create an instance of this fragment.
 * Displays some text in the center of the screen.
 */
class LargeTextFragment : Fragment() {
    private var socket: Socket? = null

    private var text: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        arguments?.let {
            text = it.getString(ARG_TEXT)
        }
        socket = getSocket(getDefaultSharedPreferences(activity))
        large_text.text = text
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        // Inflate the layout for this fragment
        val view = inflater.inflate(R.layout.fragment_large_text, container, false)
        view.setOnTouchListener { _, event ->
            socket?.emitTouch(event)
            true
        }
        return view
    }

    companion object {
        /**
         * Use this factory method to create a new instance of
         * this fragment using the provided parameters.
         *
         * @param text Text to display.
         * @return A new instance of fragment LargeTextFragment.
         */
        // TODO: Rename and change types and number of parameters
        @JvmStatic
        fun newInstance(text: String) =
                LargeTextFragment().apply {
                    arguments = Bundle().apply {
                        putString(ARG_TEXT, text)
                    }
                }
    }
}
