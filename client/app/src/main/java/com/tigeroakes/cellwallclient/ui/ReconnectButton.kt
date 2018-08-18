package com.tigeroakes.cellwallclient.ui

import android.content.Context
import android.content.res.ColorStateList
import android.util.AttributeSet
import android.util.TypedValue
import android.view.View
import android.widget.FrameLayout
import androidx.annotation.ColorInt
import androidx.core.content.ContextCompat
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.reconnect_button.view.*

/**
 * TODO: document your custom view class.
 */
class ReconnectButton : FrameLayout {
    companion object {
        enum class Status {
            DISCONNECTED,
            CONNECTING,
            CONNECTED
        }
    }

    constructor(context: Context) : super(context)
    constructor(context: Context, attrs: AttributeSet) : super(context, attrs)
    constructor(context: Context, attrs: AttributeSet, defStyle: Int) : super(context, attrs, defStyle)

    init {
        inflate(context, R.layout.reconnect_button, this)
        setStatus(Status.DISCONNECTED)
    }

    override fun setOnClickListener(listener: OnClickListener?) {
        action_reconnect?.setOnClickListener(listener)
    }

    override fun setOnLongClickListener(listener: OnLongClickListener?) {
        action_reconnect?.setOnLongClickListener(listener)
    }

    fun setStatus(status: Status) {
        val resource: Int
        @ColorInt val tint: Int
        val showProgress: Boolean
        when (status) {
            Status.CONNECTED -> {
                resource = R.drawable.ic_connected
                tint = R.color.colorPrimary
                showProgress = false
            }
            Status.CONNECTING -> {
                resource = R.drawable.ic_connecting
                tint = R.color.colorAccent
                showProgress = true
            }
            else -> {
                val typedValue = TypedValue()
                context.theme.resolveAttribute(R.attr.colorError, typedValue, true)

                resource = R.drawable.ic_disconnected
                tint = typedValue.data
                showProgress = false
            }
        }

        val drawable = ContextCompat.getDrawable(context, resource)
        action_reconnect.apply {
            setImageDrawable(drawable)
            supportBackgroundTintList = ColorStateList.valueOf(tint)
        }
        fab_reconnecting.visibility = if (showProgress) View.VISIBLE else View.INVISIBLE
    }
}
