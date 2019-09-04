package com.tigeroakes.cellwallclient

import android.content.Intent
import android.content.Intent.ACTION_ALL_APPS
import android.content.Intent.ACTION_MAIN
import android.webkit.WebSettings
import android.webkit.WebView
import com.tigeroakes.cellwallclient.WebViewController.Companion.ACTION_RELOAD
import com.tigeroakes.cellwallclient.WebViewController.Companion.ACTION_VIEW
import org.junit.Before
import org.junit.Test
import org.mockito.Mockito.*

class WebViewControllerTest {

    private lateinit var webView: WebView
    private lateinit var controller: WebViewController

    @Before
    fun setup() {
        webView = mock(WebView::class.java)
        `when`(webView.settings).thenReturn(mock(WebSettings::class.java))

        controller = WebViewController(webView)
    }

    @Test
    fun init() {
        verify(webView.settings).javaScriptEnabled = true
    }

    @Test
    fun processIntent_main() {
        controller.processIntent(mockIntent(ACTION_MAIN))

        verify(webView).loadUrl("about:blank")
    }

    @Test
    fun processIntent_view() {
        controller.processIntent(mockIntent(ACTION_VIEW))
        verify(webView).loadUrl("about:blank")

        controller.processIntent(mockIntent(ACTION_VIEW, "https://example.com"))
        verify(webView).loadUrl("https://example.com")
    }

    @Test
    fun processIntent_reload() {
        controller.processIntent(mockIntent(ACTION_RELOAD))

        verify(webView).reload()
    }

    @Test
    fun processIntent_other() {
        controller.processIntent(mockIntent(ACTION_ALL_APPS))

        verify(webView).settings
        verifyNoMoreInteractions(webView)
    }

    private fun mockIntent(action: String?, dataString: String? = null): Intent {
        val intent = mock(Intent::class.java)
        `when`(intent.action).thenReturn(action)
        `when`(intent.dataString).thenReturn(dataString)
        return intent
    }
}
