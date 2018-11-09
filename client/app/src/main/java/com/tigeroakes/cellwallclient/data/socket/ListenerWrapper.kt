package com.tigeroakes.cellwallclient.data.socket

typealias TypedListener<T> = (T) -> Unit

/**
 * Used to make functions that cast from Any to T,
 * and keep track of them.
 */
class ListenerWrappers<T>(private val convert: (Any) -> T) : Iterable<TypedListener<T>> {
    private val wrappers = mutableMapOf<TypedListener<T>, Listener>()

    fun isEmpty() = wrappers.isEmpty()

    fun makeWrapper(listener: TypedListener<T>): Listener {
        val wrapper: Listener = { args ->
            listener(convert(args[0]))
        }
        wrappers[listener] = wrapper
        return wrapper
    }

    fun deleteWrapper(listener: TypedListener<T>): Listener? {
        return wrappers[listener]?.also {
            wrappers.remove(listener)
        }
    }

    override fun iterator() = wrappers.keys.iterator()
}
