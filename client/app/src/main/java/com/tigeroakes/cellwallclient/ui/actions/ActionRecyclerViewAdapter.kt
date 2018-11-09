package com.tigeroakes.cellwallclient.ui.actions


import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.tigeroakes.cellwallclient.R
import com.tigeroakes.cellwallclient.model.Action

/**
 * [RecyclerView.Adapter] that can display [Action]s
 */
class ActionRecyclerViewAdapter : ListAdapter<Action, ActionRecyclerViewAdapter.ViewHolder>(ActionDiffUtil()) {
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val itemView = LayoutInflater.from(parent.context).inflate(R.layout.action_item, parent, false)
        return ViewHolder(itemView)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bindTo(getItem(position))
    }

    inner class ViewHolder(val view: View) : RecyclerView.ViewHolder(view) {
        private val name = view.findViewById<TextView>(R.id.action_name)

        fun bindTo(action: Action) {
            name.text = action.name
        }
    }
}
