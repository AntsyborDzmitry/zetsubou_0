package com.dhl.components.model;

import org.apache.sling.api.SlingHttpServletRequest;
import org.junit.Test;

import javax.servlet.http.Cookie;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;

public class SelectLocationModelTest {
    private static final String CONTENT = "http://localhost:4502/content/dhl/";
    private static final String URL = CONTENT + "deu/en/somePath.html";
    private static final String WRONG_URL = CONTENT + "german/de/somePath.html";
    private static final String COOKIE_KEY = "defaultCountry";
    private static final String DEFAULT_COUNTRY = "usa";
    private static final String LOGIN = "/en/auth/login.html";

    @Test
    public void shouldReturnNull() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        when(request.getCookie(COOKIE_KEY)).thenReturn(null);

        SelectLocationModel model = new SelectLocationModel(request);
        String defaultLocation = model.getDefaultLocation();
        assertNull("Default location should not be initialized.", defaultLocation);
    }

    @Test
    public void shouldReturnChangedLocation() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        Cookie cookie = new Cookie(COOKIE_KEY, DEFAULT_COUNTRY);
        StringBuffer stringBuffer = new StringBuffer(URL); // NOSONAR
        when(request.getCookie(COOKIE_KEY)).thenReturn(cookie);
        when(request.getRequestURL()).thenReturn(stringBuffer);

        SelectLocationModel model = new SelectLocationModel(request);
        String defaultLocation = model.getDefaultLocation();
        String location = new StringBuilder()
                .append(CONTENT)
                .append(DEFAULT_COUNTRY)
                .append(LOGIN)
                .toString();
        assertEquals("Default location should presented.", location, defaultLocation);
    }

    @Test
    public void shouldReturnOriginalLocation() {
        SlingHttpServletRequest request = mock(SlingHttpServletRequest.class);
        Cookie cookie = new Cookie(COOKIE_KEY, DEFAULT_COUNTRY);
        StringBuffer stringBuffer = new StringBuffer(WRONG_URL); // NOSONAR
        when(request.getCookie(COOKIE_KEY)).thenReturn(cookie);
        when(request.getRequestURL()).thenReturn(stringBuffer);

        SelectLocationModel model = new SelectLocationModel(request);
        String defaultLocation = model.getDefaultLocation();
        assertEquals("Original path should presented.", WRONG_URL, defaultLocation);
    }
}
