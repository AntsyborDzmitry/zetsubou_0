package com.dhl.services.security;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.Page;
import org.apache.commons.collections.CollectionUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

@SlingServlet(paths = "/bin/dhl/permissioncheck")
public class PermissionCheckServlet extends SlingSafeMethodsServlet {

    private static final Logger LOG = LoggerFactory.getLogger(PermissionCheckServlet.class);

    private static final String URI_PARAM = "uri";

    @Reference
    private SecurityValidator securityValidator;

    @Override
    protected void doHead(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        if (checkPermission(request)) {
            response.setStatus(SlingHttpServletResponse.SC_OK);
        } else {
            response.setStatus(SlingHttpServletResponse.SC_FORBIDDEN);
        }
    }

    private boolean checkPermission(SlingHttpServletRequest request) {
        Page page = getPage(request);
        if (page != null) {
            Set<String> permissions = getPermissions(page);
            return permissions.isEmpty() || isUserAuthorized(request, permissions);
        } else {
            return true;
        }
    }

    private Page getPage(SlingHttpServletRequest request) {
        String pageURI = request.getParameter(URI_PARAM);
        ResourceResolver resourceResolver = request.getResourceResolver();
        Resource pageResource = resourceResolver.resolve(pageURI);
        return pageResource.adaptTo(Page.class);
    }

    private Set<String> getPermissions(Page page) {
        Tag[] tags = page.getTags();
        Set<String> permissions = new HashSet<>(tags.length);
        for (Tag tag : tags) {
            permissions.add(tag.getName());
        }
        return permissions;
    }

    private boolean isUserAuthorized(SlingHttpServletRequest request, Set<String> permissions) {
        String authToken = getAuthToken(request);
        if (authToken != null) {
            try {
                Set<String> userGroups = securityValidator.getUserGroupsByToken(authToken);
                return CollectionUtils.isNotEmpty(userGroups) && CollectionUtils.containsAny(userGroups, permissions);
            } catch (TokenException e) {
                LOG.warn("Invalid token", e);
            }
        }
        return false;
    }

    private String getAuthToken(SlingHttpServletRequest request) {
        Cookie tokenCookie = request.getCookie(SecurityValidatorImpl.ECOM_SECURE_TOKEN);
        return tokenCookie != null ? tokenCookie.getValue() : null;
    }
}
