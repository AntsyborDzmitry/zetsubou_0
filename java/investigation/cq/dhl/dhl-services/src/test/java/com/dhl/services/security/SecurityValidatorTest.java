package com.dhl.services.security;


import com.dhl.services.config.PlayConfiguration;
import org.apache.wink.client.*;
import org.junit.Before;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.Set;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyObject;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

public class SecurityValidatorTest {

    private final String token = "Ahdadhajdhdkad";

    @Mock
    private RestClient restClient;

    @Mock
    private PlayConfiguration playConfiguration;

    private SecurityValidator sut;

    @Mock
    private ClientResponse response;

    @Mock
    private Resource resource;

    @Before
    public void setupGeneralBehaviour() {
        MockitoAnnotations.initMocks(this);
        mockRequest();

        sut = new SecurityValidatorImpl(restClient, playConfiguration);
    }

    @Test
    public void shouldReturnUserGroupsWhenValidToken() throws TokenException, ServiceUnavailableException {
        okResponse("{\"groups\":[\"group1\", \"group2\", \"group3\"]}");

        Set<String> groups = sut.getUserGroupsByToken(token);

        assertEquals(3, groups.size());
    }

    @Test(expected = RuntimeException.class)
    public void shouldThrowRuntimeExceptionWhenJSONIncorrect() throws TokenException, ServiceUnavailableException {
        okResponse("incorrect response body");

        sut.getUserGroupsByToken(token);
    }

    @Test(expected = TokenException.class)
    public void shouldThrowTokenExceptionWhenPlayResponds400() throws TokenException, ServiceUnavailableException {
        clientWebException(Response.Status.BAD_REQUEST);

        sut.getUserGroupsByToken(token);
    }

    @Test(expected = ServiceUnavailableException.class)
    public void shouldThrowServiceUnavailableExceptionWhenPlayResponds500() throws TokenException, ServiceUnavailableException {
        clientWebException(Response.Status.INTERNAL_SERVER_ERROR);

        sut.getUserGroupsByToken(token);
    }

    private void mockRequest() {
        when(restClient.resource(anyString())).thenReturn(resource);
        when(resource.contentType(MediaType.APPLICATION_JSON)).thenReturn(resource);
        when(resource.accept(MediaType.APPLICATION_JSON)).thenReturn(resource);
        when(resource.cookie((Cookie)anyObject())).thenReturn(resource);
    }

    private void okResponse(String body) {
        when(resource.post(ClientResponse.class, "{}")).thenReturn(response);
        when(response.getEntity(String.class)).thenReturn(body);
    }

    private void clientWebException(Response.Status status) {
        ClientWebException webException = mock(ClientWebException.class);
        when(resource.post(ClientResponse.class, "{}")).thenThrow(webException);
        when(webException.getResponse()).thenReturn(response);
        when(response.getStatusCode()).thenReturn(status.getStatusCode());
        Response.StatusType statusType = mock(Response.StatusType.class);
        when(response.getStatusType()).thenReturn(statusType);
    }
}