package com.tigeroakes.cellwallclient.model

import org.json.JSONException
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Test

class CellStateTest {
    @Test
    fun from_unknown() {
        assertEquals(
                CellState.Blank,
                CellState.from(JSONObject().apply {
                    put("type", "BLANK")
                    put("data", JSONObject())
                }))
        assertEquals(
                CellState.Blank,
                CellState.from(JSONObject().apply {
                    put("type", "ABC")
                    put("data", JSONObject())
                }))
    }

    @Test
    fun from_configure() {
        assertEquals(
                CellState.Configure("#FFFFFF", "star"),
                CellState.from(JSONObject().apply {
                    put("type", "CONFIGURE")
                    put("data", JSONObject().apply {
                        put("backgroundColor", "#FFFFFF")
                        put("icon", "star")
                    })
                }))
        assertEquals(
                CellState.Configure("#FF0000", "square"),
                CellState.from(JSONObject().apply {
                    put("type", "CONFIGURE")
                    put("data", JSONObject().apply {
                        put("backgroundColor", "#FF0000")
                        put("icon", "square")
                        put("extra", "abc")
                    })
                }))
    }

    @Test(expected = JSONException::class)
    fun from_configure_noFields() {
        CellState.from(JSONObject().apply {
            put("type", "CONFIGURE")
            put("data", JSONObject())
        })
    }

    @Test
    fun from_text() {
        assertEquals(
                CellState.Text("Hello world!"),
                CellState.from(JSONObject().apply {
                    put("type", "TEXT")
                    put("data", JSONObject().apply {
                        put("text", "Hello world!")
                        put("extra", "xyz")
                    })
                }))
    }

    @Test(expected = JSONException::class)
    fun from_text_noFields() {
        CellState.from(JSONObject().apply {
            put("type", "TEXT")
            put("data", JSONObject())
        })
    }

    @Test
    fun from_image() {
        assertEquals(
                CellState.Image("http://example.com/img.png"),
                CellState.from(JSONObject().apply {
                    put("type", "IMAGE")
                    put("data", JSONObject().apply {
                        put("src", "http://example.com/img.png")
                    })
                }))
        assertEquals(
                CellState.Image("/some/sub_path"),
                CellState.from(JSONObject().apply {
                    put("type", "IMAGE")
                    put("data", JSONObject().apply {
                        put("src", "/some/sub_path")
                        put("extra", "xyz")
                    })
                }))
    }

    @Test(expected = JSONException::class)
    fun from_image_noFields() {
        CellState.from(JSONObject().apply {
            put("type", "IMAGE")
            put("data", JSONObject())
        })
    }

    @Test
    fun from_button() {
        assertEquals(
                CellState.Button("#FFFF00"),
                CellState.from(JSONObject().apply {
                    put("type", "BUTTON")
                    put("data", JSONObject().apply {
                        put("backgroundColor", "#FFFF00")
                        put("extra", "xyz")
                    })
                }))
    }

    @Test(expected = JSONException::class)
    fun from_button_noFields() {
        CellState.from(JSONObject().apply {
            put("type", "BUTTON")
            put("data", JSONObject())
        })
    }
}
