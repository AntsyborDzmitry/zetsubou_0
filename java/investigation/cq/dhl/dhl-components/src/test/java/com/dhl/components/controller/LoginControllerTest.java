package com.dhl.components.controller;

import org.apache.commons.lang3.StringUtils;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Before;
import org.junit.Test;

import javax.servlet.http.Cookie;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class LoginControllerTest {
    private static final String MESSAGE_EMPTY_STRING = "Message should be an empty string.";
    private static final String MESSAGE_WRONG_RESPONSE = "Message should be an empty string.";

    private static final String MSG = "some message";
    private static final String LOGIN_TITLE = " login-title=\"" + MSG + "\"";
    private static final String FAKE = "fake";
    private static final String FAKE_VALUE = "fakeValue";

    private SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
    private SlingHttpServletResponse response = mock(SlingHttpServletResponse.class);
    private LoginController controller = new LoginController(request, response);

    private static final Cookie fakeCookie = new Cookie(FAKE, FAKE_VALUE);
    private static final Cookie messageCookie = new Cookie(LoginController.LOGIN_MSG_CODE_COOKIE, MSG);

    @Test
    public void shouldEmptyMessageWhenCookieNull() {
        when(request.getCookies()).thenReturn(null);
        String message = controller.getMsgAttribute();
        assertEquals(MESSAGE_EMPTY_STRING, StringUtils.EMPTY, message);
    }

    @Test
    public void shouldEmptyMessageWhenCookieNotContainMessageCode() {
        Cookie[] cookies = new Cookie[] {fakeCookie};
        when(request.getCookies()).thenReturn(cookies);
        String message = controller.getMsgAttribute();
        assertEquals(MESSAGE_EMPTY_STRING, StringUtils.EMPTY, message);
    }

    @Test
    public void shouldContainMessage() {
        Cookie[] cookies = new Cookie[] {fakeCookie, messageCookie};
        when(request.getCookies()).thenReturn(cookies);
        String message = controller.getMsgAttribute();
        assertEquals(MESSAGE_WRONG_RESPONSE, LOGIN_TITLE, message);
    }
}
