package com.tigeroakes.cellwallclient.ui.actions

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.ui.actions.dummy.DummyContent

/**
 * A fragment representing a list of Items.
 */
class ActionsFragment : Fragment() {
    companion object {
        fun newInstance() = ActionsFragment()
    }

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?,
                              savedInstanceState: Bundle?): View? {
        val view = inflater.inflate(R.layout.actions_fragment, container, false)

        // Set the adapter
        if (view is RecyclerView) {
            with(view) {
                layoutManager = LinearLayoutManager(context)
                adapter = ActionRecyclerViewAdapter(DummyContent.ITEMS)
            }
        }
        return view
    }
}
