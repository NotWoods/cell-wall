package com.tigeroakes.cellwallclient.model

import org.junit.Assert.*
import org.junit.Test

class EventTest {
    class TestClass

    @Test
    fun event_peek() {
        val obj = TestClass()
        val event = Event(obj)

        assertFalse(event.hasBeenHandled)
        assertEquals(obj, event.peekContent())
        assertFalse(event.hasBeenHandled)
        event.getContentIfNotHandled()
        assertEquals(obj, event.peekContent())
    }

    @Test
    fun event_getIfNotHandled() {
        val obj = TestClass()
        val event = Event(obj)

        assertFalse(event.hasBeenHandled)
        assertEquals(obj, event.getContentIfNotHandled())
        assertTrue(event.hasBeenHandled)
        assertNull(event.getContentIfNotHandled())
    }
}