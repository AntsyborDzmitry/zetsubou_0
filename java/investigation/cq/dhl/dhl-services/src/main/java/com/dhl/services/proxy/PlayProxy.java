package com.dhl.services.proxy;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.ws.rs.DELETE;
import javax.ws.rs.Encoded;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import com.dhl.services.config.PlayConfiguration;
import org.apache.felix.scr.annotations.*;
import org.apache.poi.util.IOUtils;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.wink.client.ClientResponse;
import org.apache.wink.client.ClientRuntimeException;
import org.apache.wink.client.Resource;
import org.apache.wink.client.RestClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Special utility class only for development phase Allows to proxy all requests
 * from cq to play
 * 
 * Configuration for component (policy = ConfigurationPolicy.REQUIRE) means that
 * this class will be created for specified runmode only if exists configuration
 * for this class (com.dhl.services.proxy.PlayProxy.xml)
 */
@Component(label = "Play proxy service", metatype = true, policy = ConfigurationPolicy.REQUIRE)
@Service(Object.class)
@Property(name = "javax.ws.rs", boolValue = true)
@Path("/api")
public class PlayProxy {
    private static final Logger LOG = LoggerFactory.getLogger(PlayProxy.class);

    @Reference
    private transient PlayConfiguration playConfiguration;

    @GET
    @Path("{playPath : ([\\S]+)?}")
    public void processGet(@Encoded @PathParam("playPath") String playPath, @Context UriInfo uriInfo,
            @Context HttpServletRequest request, @Context HttpServletResponse response)
            throws UnsupportedEncodingException {
        MultivaluedMap<String, String> queryParameters = uriInfo.getQueryParameters();

        String urlParams = "?";
        for (Map.Entry<String, List<String>> entry : queryParameters.entrySet()) {
            String queryKey = entry.getKey();
            for (String s : entry.getValue()) {
                urlParams += queryKey + "=" + URLEncoder.encode(s, "UTF-8") + "&"; // NOSONAR
            }
        }
        urlParams = urlParams.substring(0, urlParams.length() - 1);
        process(playPath + urlParams, HttpConstants.METHOD_GET, request, response);
    }

    @POST
    @Path("{playPath : ([\\S]+)?}")
    public void processPost(@Encoded @PathParam("playPath") String playPath, @Context HttpServletRequest request,
            @Context HttpServletResponse response) {
        process(playPath, HttpConstants.METHOD_POST, request, response);
    }

    @PUT
    @Path("{playPath : ([\\S]+)?}")
    public void processPut(@Encoded @PathParam("playPath") String playPath, @Context HttpServletRequest request,
                            @Context HttpServletResponse response) {
        process(playPath, HttpConstants.METHOD_PUT, request, response);
    }

    @DELETE
    @Path("{playPath : ([\\S]+)?}")
    public void processDelete(@Encoded @PathParam("playPath") String playPath, @Context HttpServletRequest request,
                           @Context HttpServletResponse response) {
        process(playPath, HttpConstants.METHOD_DELETE, request, response);
    }

    private void process(String playPath, String method, HttpServletRequest request, HttpServletResponse response) {
        Resource resource = getResourceToRetrieve(request, playPath);

        ClientResponse clientResponse;
        try {
            clientResponse = processRequest(resource, method, request);
        } catch (ClientRuntimeException e) {
            LOG.warn("Service unavailable: {}", playPath, e);
            response.setStatus(Response.Status.SERVICE_UNAVAILABLE.getStatusCode());
            return;
        }

        try {
            processClientResponse(response, clientResponse);
        } catch (IOException e) {
            LOG.warn("Failed retrieved body: {}", playPath, e);
            response.setStatus(Response.Status.INTERNAL_SERVER_ERROR.getStatusCode());
        }
    }

    private void processClientResponse(HttpServletResponse outResponse, ClientResponse clientResponse)
            throws IOException {
        outResponse.setHeader("X-Proxed-By", "CQ");

        for (Map.Entry<String, List<String>> entry : clientResponse.getHeaders().entrySet()) {
            String key = entry.getKey();
            if (key != null) {
                for (Object value : entry.getValue()) {
                    outResponse.setHeader(key, (String) value);
                }
            }
        }

        outResponse.setStatus(clientResponse.getStatusCode());

        OutputStream responseStream = outResponse.getOutputStream();
        if (clientResponse.getEntity(InputStream.class) != null) {
            IOUtils.copy(clientResponse.getEntity(InputStream.class), responseStream);
        }
        responseStream.flush();
    }

    private Resource getResourceToRetrieve(HttpServletRequest request, String playPath) {
        String fullUrl = playConfiguration.getPlayURL() + '/' + playPath;
        Resource resource = new RestClient().resource(fullUrl);
        for (Enumeration<?> headerNames = request.getHeaderNames(); headerNames.hasMoreElements();) {
            String headerName = (String) headerNames.nextElement();
            resource.header(headerName, request.getHeader(headerName));
        }
        return resource;
    }

    /**
     * @param resource resource to call
     * @param method HTTP method
     * @return response
     * @throws ClientRuntimeException when target server not responding
     */
    private ClientResponse processRequest(Resource resource, String method, HttpServletRequest request) {
        if (HttpConstants.METHOD_GET.equalsIgnoreCase(method)) {
            return resource.get();
        } else if (HttpConstants.METHOD_DELETE.equalsIgnoreCase(method)) {
            return resource.delete();
        }

        InputStream is = requestAsInputStream(request);
        if (HttpConstants.METHOD_POST.equalsIgnoreCase(method)) {
            return resource.post(is);
        } else if (HttpConstants.METHOD_PUT.equalsIgnoreCase(method)) {
            return resource.put(is);
        }

        throw new ClientRuntimeException("Only GET, POST, PUT and DELETE methods can be processed");
    }

    private InputStream requestAsInputStream(HttpServletRequest request) {
        try {
            return request.getInputStream();
        } catch (IOException e) {
            throw new ClientRuntimeException("can't get request input stream", e);
        }
    }
}