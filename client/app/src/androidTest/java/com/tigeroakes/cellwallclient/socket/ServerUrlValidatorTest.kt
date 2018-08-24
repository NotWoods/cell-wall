package com.tigeroakes.cellwallclient.socket

import android.net.Uri
import android.webkit.URLUtil
import androidx.core.net.toUri
import androidx.test.runner.AndroidJUnit4
import com.tigeroakes.cellwallclient.socket.ServerUrlValidator.Reason
import com.tigeroakes.cellwallclient.socket.ServerUrlValidator.guessUri
import com.tigeroakes.cellwallclient.socket.ServerUrlValidator.validate
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Ignore
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ServerUrlValidatorTest {
    private val noSuccess: (serverUri: Uri) -> Unit = {
        assertTrue("onSuccess called when onFailed should be called", false)
    }
    private val noFailure: (reason: Reason) -> Unit = {
        assertTrue("onFailure called when onSuccess should be called", false)
    }

    @Test
    fun guessUri() {
        assertEquals(null, guessUri(""))
        assertEquals(null, guessUri("data:some"))
        assertEquals("http://www.abc.com/".toUri(), guessUri("abc"))
        assertEquals("http://192.168.0.1/".toUri(), guessUri("192.168.0.1"))
    }

    @Test
    fun validate_empty() {
        validate(null, noSuccess) { assertEquals(Reason.BLANK, it) }
        validate("", noSuccess) { assertEquals(Reason.BLANK, it) }

        assertEquals("http://www.abc.com/", URLUtil.guessUrl("abc"))
        assertTrue(URLUtil.isNetworkUrl("http://www.abc.com/"))
        assertEquals(Uri.parse("http://www.abc.com/"), "http://www.abc.com/".toUri())
    }

    @Test @Ignore
    fun validate_badFormat() {
        validate("abc", noSuccess) { assertEquals(Reason.BAD_FORMAT, it) }
        validate("192.168", noSuccess) { assertEquals(Reason.BAD_FORMAT, it) }
    }

    @Test @Ignore
    fun validate_guess() {
        MockWebServer().apply {
            enqueue(MockResponse().setResponseCode(204))
            enqueue(MockResponse().setResponseCode(204))
            enqueue(MockResponse().setResponseCode(204))
            enqueue(MockResponse().setResponseCode(204))
            start()
        }.use { _ ->
            validate("example.com", onFailure = noFailure, onSuccess = {
                assertEquals("http://example.com".toUri(), it)
            })
            validate("192.168.0.1", onFailure = noFailure, onSuccess = {
                assertEquals("http://192.168.0.1".toUri(), it)
            })
            validate("example.com:3000", onFailure = noFailure, onSuccess = {
                assertEquals("http://example.com:3000".toUri(), it)
            })
            validate("https://192.168.0.1", onFailure = noFailure, onSuccess = {
                assertEquals("https://192.168.0.1".toUri(), it)
            })
        }
    }

    @Test @Ignore
    fun validate_requestBuilder() {
        MockWebServer().apply {
            enqueue(MockResponse().setResponseCode(204))
            start()
        }.use { server ->
            validate("example.com", {}, {})
            assertEquals("/cell", server.takeRequest().path)
        }
    }

    @Test @Ignore
    fun validate_callFailed() {
        validate("example.com", noSuccess) { assertEquals(Reason.PATH_DOES_NOT_EXIST, it) }
    }

    @Test @Ignore
    fun validate_returnedError() {
        MockWebServer().apply {
            enqueue(MockResponse().setResponseCode(400))
            start()
        }.use { _ ->
            validate("example.com", noSuccess) { assertEquals(Reason.PATH_DOES_NOT_EXIST, it) }
        }
    }
}