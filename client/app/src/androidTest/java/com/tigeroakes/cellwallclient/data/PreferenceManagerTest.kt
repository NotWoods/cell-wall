package com.tigeroakes.cellwallclient.data

import com.tigeroakes.cellwallclient.MockSharedPreference
import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Before
import org.junit.Test

class PreferenceManagerTest {
    private lateinit var mockSharedPreferences: MockSharedPreference

    @Before
    fun setup() {
        mockSharedPreferences = MockSharedPreference()
    }

    @Test
    fun serverAddress() {
        val manager = PreferenceManager(mockSharedPreferences)
        assertNull(manager.serverAddress)

        manager.serverAddress = "https://localhost/some-address"
        assertEquals("https://localhost/some-address", manager.serverAddress)

        assertEquals(
                "https://localhost/some-address",
                mockSharedPreferences.getString(SERVER_ADDRESS_KEY, null)
        )
    }

    @Test
    fun installationId() {
        val manager = PreferenceManager(mockSharedPreferences)
        assertNull(manager.installationId)

        manager.installationId = "some-uuid-1234"
        assertEquals("some-uuid-1234", manager.installationId)

        assertEquals(
                "some-uuid-1234",
                mockSharedPreferences.getString(INSTALLATION_ID_KEY, null)
        )
    }
}
