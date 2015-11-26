package com.dhl.services.security;

import com.dhl.services.TestConstants;
import com.dhl.services.mock.HttpMocks;
import com.dhl.services.service.HttpService;
import com.dhl.services.service.HttpServiceImpl;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.mockito.Mockito.*;

public class HttpServiceTest {

    private HttpService sut;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private RequestDispatcher requestDispatcher;

    @Mock
    private Cookie cookie;

    @Mock
    private HttpServletResponse httpServletResponse;

    @Mock
    private HttpServletRequest httpServletRequest;

    @Before
    public void setupGeneralBehaviour() {
        MockitoAnnotations.initMocks(this);
        sut = new HttpServiceImpl();
    }

    @Test
    public void shouldRedirectToLoginPage() throws IOException {
        SlingHttpServletRequest request = HttpMocks.mockRequest(TestConstants.SHIPMENT_URL).build();

        sut.redirectToLogin(request, response, null);

        verify(response, times(1)).sendRedirect(TestConstants.LOGIN_URL);
    }

    @Test
    public void forwardOnForbiddenTest() throws IOException {
        sut.forwardOnForbidden(httpServletRequest, httpServletResponse);
        verify(httpServletResponse, times(1)).setStatus(HttpServletResponse.SC_FORBIDDEN);
    }

    @Test
    public void removeSecurityTokenFromCookieTest() throws IOException {
        sut.removeSecurityTokenFromCookie(httpServletResponse);
        verify(httpServletResponse, times(1)).addCookie(any(Cookie.class));
    }

    @Test
    public void forwardOnErrorPageTest() throws ServletException, IOException {
        when(httpServletRequest.getRequestDispatcher(anyString())).thenReturn(requestDispatcher);
        when(httpServletRequest.getRequestURI()).thenReturn("/content/dhl/master_languages/en/account-benefits.html");
        sut.forwardOnErrorPage(httpServletRequest, httpServletResponse);
        verify(requestDispatcher, times(1)).forward(httpServletRequest, httpServletResponse);
    }

}