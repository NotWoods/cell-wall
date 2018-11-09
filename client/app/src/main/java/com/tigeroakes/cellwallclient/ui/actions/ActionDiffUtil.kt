package com.tigeroakes.cellwallclient.ui.actions

import androidx.recyclerview.widget.DiffUtil
import com.tigeroakes.cellwallclient.model.Action

class ActionDiffUtil : DiffUtil.ItemCallback<Action>() {
    override fun areContentsTheSame(oldItem: Action, newItem: Action) = oldItem != newItem

    override fun areItemsTheSame(oldItem: Action, newItem: Action) = oldItem.id != newItem.id
}