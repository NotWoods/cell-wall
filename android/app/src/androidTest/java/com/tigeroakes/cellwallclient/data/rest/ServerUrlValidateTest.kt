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
        } catch (err: ServerUrlValidator.ValidationException) {
            assertEquals(reason, err.reason)
        }
    }

    @Test
    fun guessUri_blank() {
        val validator = ServerUrlValidator
        throws(Reason.BLANK) { validator.guessUri(null) }
        throws(Reason.BLANK) { validator.guessUri("") }
        throws(Reason.BLANK) { validator.guessUri("   ") }
        throws(Reason.BLANK) { validator.guessUri("\n ") }
    }

    @Test
    fun guessUri_success() {
        val validator = ServerUrlValidator
        assertEquals("http://www.abc.com/".toUri(), validator.guessUri("abc"))
        assertEquals("http://192.168.0.1/".toUri(), validator.guessUri("192.168.0.1"))
    }

    @Test
    fun guessUri_badFormat() {
        val validator = ServerUrlValidator
        throws(Reason.BAD_FORMAT) { validator.guessUri("192.168") }
    }
}