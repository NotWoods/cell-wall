package com.tigeroakes.cellwallclient.ui.main

import android.content.Context
import android.content.res.ColorStateList
import android.util.AttributeSet
import android.util.TypedValue
import android.view.View
import android.widget.FrameLayout
import androidx.annotation.ColorInt
import androidx.annotation.DrawableRes
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.core.content.res.ResourcesCompat
import com.tigeroakes.cellwallclient.R
import kotlinx.android.synthetic.main.reconnect_button.view.*

/**
 * TODO: document your custom view class.
 */
class ReconnectButton : FrameLayout {
    companion object {
        enum class Status(val value: Int) {
            DISCONNECTED(0),
            CONNECTING(1),
            CONNECTED(2);

            companion object {
                private val map = Status.values().associateBy(Status::value)
                fun fromInt(type: Int) = map[type] ?: DISCONNECTED
            }
        }
    }

    init {
        inflate(context, R.layout.reconnect_button, this)
    }

    constructor(context: Context) : super(context) {
        setStatus(Status.DISCONNECTED)
    }
    constructor(context: Context, attrs: AttributeSet) : super(context, attrs) {
        readAttributes(attrs, 0, 0)
    }
    constructor(context: Context, attrs: AttributeSet, defStyle: Int) : super(context, attrs, defStyle) {
        readAttributes(attrs, defStyle, 0)
    }
    @RequiresApi(21)
    constructor(context: Context, attrs: AttributeSet, defStyleAttr: Int, defStyleRes: Int) : super(context, attrs, defStyleAttr, defStyleRes) {
        readAttributes(attrs, defStyleAttr, defStyleRes)
    }

    private fun readAttributes(attrs: AttributeSet, defStyleAttr: Int, defStyleRes: Int) {
        context.theme.obtainStyledAttributes(
                attrs,
                R.styleable.ReconnectButton,
                defStyleAttr,
                defStyleRes).run {
            try {
                val statusInt = getInteger(R.styleable.ReconnectButton_status, 0)
                setStatus(Status.fromInt(statusInt))
            } finally {
                recycle()
            }
        }
    }

    override fun setOnClickListener(listener: OnClickListener?) {
        action_reconnect?.setOnClickListener(listener)
    }

    override fun setOnLongClickListener(listener: OnLongClickListener?) {
        action_reconnect?.setOnLongClickListener(listener)
    }

    fun setStatus(status: Status) {
        @DrawableRes val resource: Int
        @ColorInt val tint: Int
        val showProgress: Boolean
        when (status) {
            Status.CONNECTED -> {
                resource = R.drawable.ic_connected
                tint = ResourcesCompat.getColor(resources, R.color.colorPrimary, context.theme)
                showProgress = false
            }
            Status.CONNECTING -> {
                resource = R.drawable.ic_connecting
                tint = ResourcesCompat.getColor(resources, R.color.colorAccent, context.theme)
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
        action_reconnect.run {
            setImageDrawable(drawable)
            supportBackgroundTintList = ColorStateList.valueOf(tint)
        }
        fab_reconnecting.visibility = if (showProgress) View.VISIBLE else View.INVISIBLE
    }

    fun showIf(value: Boolean) {
        if (value) {
            action_reconnect.show()
        } else {
            action_reconnect.hide()
        }
    }
}
