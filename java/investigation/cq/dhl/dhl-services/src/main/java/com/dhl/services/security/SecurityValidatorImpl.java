package com.dhl.services.security;

import com.dhl.services.config.PlayConfiguration;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.commons.json.JSONArray;
import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.apache.wink.client.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.ws.rs.core.Cookie;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.HashSet;
import java.util.Set;

@Component
@Service(SecurityValidator.class)
public class SecurityValidatorImpl implements SecurityValidator {
    private static final Logger LOG = LoggerFactory.getLogger(SecurityValidatorImpl.class);

    public static final String ECOM_SECURE_TOKEN = "ecomWFPro";

    // NLS
    private static final String TIMED_OUT = "login.form_title_session_timed_out";

    @Reference
    private PlayConfiguration playConfiguration;

    private RestClient restClient;

    public SecurityValidatorImpl() {
        restClient = new RestClient();
    }

    /**
     * for unit test only
     */
    SecurityValidatorImpl(RestClient restClient, PlayConfiguration playConfiguration) {
        this.restClient = restClient;
        this.playConfiguration = playConfiguration;
    }

    @Override
    public Set<String> getUserGroupsByToken(String token) throws TokenException {
        /**
         * {
         *  "userid": "email@dhl.com",
         *  "groups": ["regular"]
         * }
         */
        String responseJson = readUserGroupsFromCore(token);
        Set<String> userGroups;
        try {
            JSONObject outJson = new JSONObject(responseJson);
            JSONArray groups = outJson.getJSONArray("groups");
            userGroups = new HashSet<>(groups.length());
            for (int i = 0; i < groups.length(); i++) {
                userGroups.add(groups.getString(i));
            }
        } catch (JSONException e) {
            throw new IllegalArgumentException("Play response parsing exception. response: " + responseJson, e);
        }

        return userGroups;
    }

    private String readUserGroupsFromCore(String token) throws TokenException {
        ClientResponse response;
        try {
            response = processRequest(token, "/auth/validate");
        } catch (ClientWebException e) {
            handleClientWebException(e);

            throw e;
        } catch (ClientRuntimeException e) {
            throw new ServiceUnavailableException("Token validation service not respond", e);
        }

        return response.getEntity(String.class);
    }

    private void handleClientWebException(ClientWebException e) throws TokenException {
        ClientResponse errResponse = e.getResponse();
        String responseText = errResponse.getStatusType().getReasonPhrase();
        int responseCode = errResponse.getStatusCode();

        LOG.error("Token validation error: {}, {}", responseCode, responseText);

        if (responseCode == Response.Status.BAD_REQUEST.getStatusCode() /* broken token*/) {
            throw new TokenException("Token is not valid. " + responseText);
        }
        if (responseCode == Response.Status.UNAUTHORIZED.getStatusCode() /* token expired */) {
            throw new TokenException(TIMED_OUT);
        }
        throw new ServiceUnavailableException("Token validation service error: " + responseCode, e);
    }

    private ClientResponse processRequest(String token, String servicePath) {
        String uri = playConfiguration.getPlayURL() + servicePath;
        LOG.debug("sending token {} validation request on {}", token, uri);
        Resource resource = restClient.resource(uri);
        return resource.contentType(MediaType.APPLICATION_JSON)
                .accept(MediaType.APPLICATION_JSON).cookie(new Cookie(ECOM_SECURE_TOKEN, token))
                .post(ClientResponse.class, "{}");
    }
}