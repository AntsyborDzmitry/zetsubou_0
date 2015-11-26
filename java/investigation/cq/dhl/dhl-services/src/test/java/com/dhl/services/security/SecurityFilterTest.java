package com.dhl.services.security;

import com.dhl.services.service.HttpService;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Collections;

import static com.dhl.services.mock.HttpMocks.mockRequest;
import static org.mockito.Mockito.*;

public class SecurityFilterTest {
    private static final String PUBLIC_URL = "/public/url";
    private static final String PRIVATE_URL = "/private/url";
    private static final String VALID_TOKEN = "validToken";
    private static final String VALID_USER_GROUP = "validUserGroup";
    private static final String INVALID_TOKEN = "invalidToken";

    @Mock
    private SecurityValidator validator;

    @Mock
    private HttpService httpService;

    private SecurityFilter sut;

    @Mock
    private SlingHttpServletResponse response;

    @Mock
    private FilterChain filterChain;

    @Before
    public void setupGeneralBehaviour() throws Exception {
        MockitoAnnotations.initMocks(this);

        // define valid valid tokens and map them on user groups
        when(validator.getUserGroupsByToken(VALID_TOKEN)).thenReturn(Collections.singleton(VALID_USER_GROUP));
        when(validator.getUserGroupsByToken(INVALID_TOKEN)).thenThrow(TokenException.class);

        sut = new SecurityFilter(validator, httpService);
    }

    @Test
    public void shouldPassUnauthorizedUserOnPublicPage() throws ServletException, IOException {
        SlingHttpServletRequest request = mockRequest(PUBLIC_URL).build();

        sut.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    public void shouldDenyAccessToProtectedPagesWithoutToken() throws ServletException, IOException {
        SlingHttpServletRequest request = mockRequest(PRIVATE_URL).tags(VALID_USER_GROUP).build();

        sut.doFilter(request, response, filterChain);

        verifyZeroInteractions(validator);
        verify(httpService, times(1)).redirectToLogin(request, response, null);
    }

    @Test
    public void shouldDoFilterWhenUserAuthSuccess() throws Exception {
        SlingHttpServletRequest request = mockRequest(PRIVATE_URL).tags(VALID_USER_GROUP).token(VALID_TOKEN).build();

        sut.doFilter(request, response, filterChain);

        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    public void shouldNotReadLoggedUserInfoEvenForPublicPages() throws Exception {
        SlingHttpServletRequest request = mockRequest(PUBLIC_URL).token(VALID_TOKEN).build();

        sut.doFilter(request, response, filterChain);

        verify(validator, times(0)).getUserGroupsByToken(VALID_TOKEN);
    }

    @Test
    public void shouldNotClearCookieWhenNavigateOnPublicPageWithInvalidToken() throws Exception {
        SlingHttpServletRequest request = mockRequest(PUBLIC_URL).token(INVALID_TOKEN).build();

        sut.doFilter(request, response, filterChain);

        verify(httpService, times(0)).removeSecurityTokenFromCookie(response);
    }

    @Test
    public void shouldDenyAccessForProtectedPagesWithWrongToken() throws Exception {
        SlingHttpServletRequest request = mockRequest(PRIVATE_URL).tags(VALID_USER_GROUP).token(INVALID_TOKEN).build();

        sut.doFilter(request, response, filterChain);

        verify(httpService, times(1)).redirectToLogin(request, response, null);
        verify(httpService, times(1)).removeSecurityTokenFromCookie(response);
    }

    @Test
    public void shouldRespondWith500WhenPlayUnavailable() throws Exception {
        SlingHttpServletRequest request = mockRequest(PRIVATE_URL).tags(VALID_USER_GROUP).token(VALID_TOKEN).build();
        when(validator.getUserGroupsByToken(anyString())).thenThrow(ServiceUnavailableException.class);

        sut.doFilter(request, response, filterChain);

        verify(httpService, times(1)).forwardOnErrorPage(request, response);
    }
}
