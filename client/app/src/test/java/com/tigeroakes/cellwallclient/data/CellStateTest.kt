package com.tigeroakes.cellwallclient.data

import org.json.JSONException
import org.json.JSONObject
import org.junit.Assert
import org.junit.Test

class CellStateTest {
    @Test
    fun from_unknown() {
        Assert.assertEquals(CellState.Blank, CellState.from("BLANK", JSONObject()))
        Assert.assertEquals(CellState.Blank, CellState.from("ABC", JSONObject()))
    }

    @Test
    fun from_configure() {
        Assert.assertEquals(
                CellState.Configure("#FFFFFF", "star"),
                CellState.from("CONFIGURE", JSONObject().apply {
                    put("backgroundColor", "#FFFFFF")
                    put("icon", "star")
                }))
        Assert.assertEquals(
                CellState.Configure("#FF0000", "square"),
                CellState.from("CONFIGURE", JSONObject().apply {
                    put("backgroundColor", "#FF0000")
                    put("icon", "square")
                    put("extra", "abc")
                }))
    }

    @Test(expected = JSONException::class)
    fun from_configure_noFields() {
        CellState.from("CONFIGURE", JSONObject())
    }

    @Test
    fun from_text() {
        Assert.assertEquals(
                CellState.Text("Hello world!"),
                CellState.from("TEXT", JSONObject().apply {
                    put("text", "Hello world!")
                    put("extra", "xyz")
                }))
    }

    @Test(expected = JSONException::class)
    fun from_text_noFields() {
        CellState.from("TEXT", JSONObject())
    }

    @Test
    fun from_image() {
        Assert.assertEquals(
                CellState.Image("http://example.com/img.png"),
                CellState.from("IMAGE", JSONObject().apply {
                    put("src", "http://example.com/img.png")
                }))
        Assert.assertEquals(
                CellState.Image("/some/sub_path"),
                CellState.from("IMAGE", JSONObject().apply {
                    put("src", "/some/sub_path")
                    put("extra", "xyz")
                }))
    }

    @Test(expected = JSONException::class)
    fun from_image_noFields() {
        CellState.from("IMAGE", JSONObject())
    }

    @Test
    fun from_button() {
        Assert.assertEquals(
                CellState.Button("#FFFF00"),
                CellState.from("BUTTON", JSONObject().apply {
                    put("backgroundColor", "#FFFF00")
                    put("extra", "xyz")
                }))
    }

    @Test(expected = JSONException::class)
    fun from_button_noFields() {
        CellState.from("BUTTON", JSONObject())
    }
}
