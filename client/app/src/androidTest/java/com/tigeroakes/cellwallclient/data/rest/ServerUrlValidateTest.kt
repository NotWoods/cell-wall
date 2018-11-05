package com.tigeroakes.cellwallclient.data.rest

import androidx.core.net.toUri
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Test

class ServerUrlValidatorTest {
    private fun throws(reason: Reason, func: () -> Unit) {
        try {
            func()
            assertFalse("Exception not thrown", true)
        } catch (err: ServerUrlValidationException) {
            assertEquals(reason, err.reason)
        }
    }

    @Test
    fun guessUri_blank() {
        throws(Reason.BLANK) { guessUri(null) }
        throws(Reason.BLANK) { guessUri("") }
        throws(Reason.BLANK) { guessUri("   ") }
        throws(Reason.BLANK) { guessUri("\n ") }
    }

    @Test
    fun guessUri_success() {
        assertEquals("http://www.abc.com/".toUri(), guessUri("abc"))
        assertEquals("http://192.168.0.1/".toUri(), guessUri("192.168.0.1"))
    }

    @Test
    fun guessUri_badFormat() {
        throws(Reason.BAD_FORMAT) { guessUri("192.168") }
    }
}