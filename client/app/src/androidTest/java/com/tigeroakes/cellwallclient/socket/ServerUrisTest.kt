package com.tigeroakes.cellwallclient.socket

import androidx.core.net.toUri
import androidx.test.runner.AndroidJUnit4
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class ServerUrisTest {
    @Test
    fun withPingPath() {
        assertEquals("http://192.168.0.1/is-cellwall-server".toUri(),
                ServerUris.withPingPath("http://192.168.0.1".toUri()))
        assertEquals("http://example.com/is-cellwall-server".toUri(),
                ServerUris.withPingPath("http://example.com".toUri()))
        assertEquals("https://sub.example.org/is-cellwall-server".toUri(),
                ServerUris.withPingPath("https://sub.example.org".toUri()))
        assertEquals("https://example.org/subpath/is-cellwall-server".toUri(),
                ServerUris.withPingPath("https://example.org/subpath".toUri()))
    }

    @Test
    fun withSocketNamespace() {
        assertEquals("http://192.168.0.1/cell".toUri(),
                ServerUris.withSocketNamespace("http://192.168.0.1".toUri()))
        assertEquals("http://example.com/cell".toUri(),
                ServerUris.withSocketNamespace("http://example.com".toUri()))
        assertEquals("https://sub.example.org/cell".toUri(),
                ServerUris.withSocketNamespace("https://sub.example.org".toUri()))
        assertEquals("https://example.org/subpath/cell".toUri(),
                ServerUris.withSocketNamespace("https://example.org/subpath".toUri()))
    }

    @Test
    fun addImageHost_hostExists() {
        val serverUrl = "https://example.com".toUri()

        assertEquals("http://192.168.0.1/img".toUri(),
                ServerUris.addImageHost("http://192.168.0.1/img", serverUrl))
        assertEquals("http://example.com/img".toUri(),
                ServerUris.addImageHost("http://example.com/img", serverUrl))
        assertEquals("https://sub.example.org/img".toUri(),
                ServerUris.addImageHost("https://sub.example.org/img", serverUrl))
    }

    @Test
    fun addImageHost_hostNotExists() {
        val imgSrc = "/img"

        assertEquals("http://192.168.0.1/img".toUri(),
                ServerUris.addImageHost(imgSrc, "http://192.168.0.1".toUri()))
        assertEquals("http://example.com/img".toUri(),
                ServerUris.addImageHost(imgSrc, "http://example.com".toUri()))
        assertEquals("https://sub.example.org/img".toUri(),
                ServerUris.addImageHost(imgSrc, "https://sub.example.org/".toUri()))
        assertEquals("https://example.org/subpath/img".toUri(),
                ServerUris.addImageHost(imgSrc, "https://example.org/subpath".toUri()))
    }
}
