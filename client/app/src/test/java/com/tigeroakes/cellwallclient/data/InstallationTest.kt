package com.tigeroakes.cellwallclient.data

import android.content.SharedPreferences
import com.tigeroakes.cellwallclient.INSTALLATION_ID_KEY
import org.junit.Assert.assertEquals
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith
import org.mockito.ArgumentMatchers.anyString
import org.mockito.ArgumentMatchers.eq
import org.mockito.Mock
import org.mockito.Mockito.`when`
import org.mockito.Mockito.verify
import org.mockito.junit.MockitoJUnitRunner
import java.util.*

@RunWith(MockitoJUnitRunner::class)
class InstallationTest {
    @Mock
    lateinit var mockSharedPreferences: SharedPreferences
    @Mock
    lateinit var mockEditor: SharedPreferences.Editor

    @Before
    fun setup() {
        `when`(mockSharedPreferences.edit()).thenReturn(mockEditor)
        `when`(mockEditor.putString(eq(INSTALLATION_ID_KEY), anyString())).thenReturn(mockEditor)
        Installation.resetId()
    }

    @Test
    fun id_create() {
        `when`(mockSharedPreferences.getString(INSTALLATION_ID_KEY, null))
                .thenReturn(null)

        val id = UUID.fromString(Installation.id(mockSharedPreferences))
        verify(mockEditor).putString(INSTALLATION_ID_KEY, id.toString())
    }

    @Test
    fun id_get() {
        val id = UUID.randomUUID().toString()
        `when`(mockSharedPreferences.getString(INSTALLATION_ID_KEY, null)).thenReturn(id)

        assertEquals(id, Installation.id(mockSharedPreferences))
    }
}
