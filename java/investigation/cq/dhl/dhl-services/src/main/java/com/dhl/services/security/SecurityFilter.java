package com.dhl.services.security;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Set;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.collections.CollectionUtils;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingFilter;
import org.apache.felix.scr.annotations.sling.SlingFilterScope;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.day.cq.tagging.Tag;
import com.day.cq.wcm.api.NameConstants;
import com.day.cq.wcm.api.Page;
import com.dhl.services.service.HttpService;

@SlingFilter(generateComponent = false, generateService = true, order = 1, scope = SlingFilterScope.REQUEST)
@Component(immediate = true)
public class SecurityFilter implements javax.servlet.Filter {
    private static final Logger LOG = LoggerFactory.getLogger(SecurityFilter.class);

    @Reference
    private SecurityValidator validator;

    @Reference
    private HttpService httpService;

    public SecurityFilter() {
        //should be empty
    }

    /**
     * for unit tests only
     */
    SecurityFilter(SecurityValidator validator, HttpService httpService) {
        this.validator = validator;
        this.httpService = httpService;
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.debug("init SecurityFilter");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
                         FilterChain filterChain) throws ServletException, IOException {
        SlingHttpServletRequest httpRequest = (SlingHttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        Resource resource = httpRequest.getResource();
        boolean cqPage = resource.isResourceType(NameConstants.NT_PAGE);
        if (!cqPage) {
            filterChain.doFilter(request, response);
            return;
        }

        Page page = resource.adaptTo(Page.class);
        Tag[] tags = page.getTags();
        List<String> permissions = new ArrayList<>(tags.length);
        for (Tag tag : tags) {
            permissions.add(tag.getName());
        }

        if (permissions.isEmpty()) {
            // TODO: set Akamai headers that resource can be cached
            if (LOG.isDebugEnabled()) {
                LOG.debug("user requested public page \"" + page.getPath() + "\"");
            }
            filterChain.doFilter(request, response);
            return;
        }

        if(!isUserAuthorized(httpRequest, httpResponse, page, permissions)) {
        	return;
        }
        // TODO: set Akamai headers that resource can't be cached
        filterChain.doFilter(request, response);
    }
    
    private boolean isUserAuthorized(SlingHttpServletRequest httpRequest, HttpServletResponse httpResponse, Page page,
            List<String> permissions) throws IOException, ServletException {
        Cookie tokenCookie = httpRequest.getCookie(SecurityValidatorImpl.ECOM_SECURE_TOKEN);
        String token = tokenCookie != null ? tokenCookie.getValue() : null;
        if (token == null) {
            if (LOG.isDebugEnabled()) {
                LOG.debug("user without cookie attempts to access page \"" + page.getPath() + "\" restricted to "
                        + permissions);
            }
            httpService.redirectToLogin(httpRequest, httpResponse, /* msgCode */null);
            return false;
        }

        Set<String> userGroups = getUserGroups(httpRequest, httpResponse, token);
        if (CollectionUtils.isEmpty(userGroups)) {
            return false;
        }

        if (LOG.isDebugEnabled()) {
            LOG.debug("user attempts to access page \"" + page.getPath() + "\" restricted to " + permissions
                    + ". User roles: " + userGroups);
        }

        boolean userAuthorized = CollectionUtils.containsAny(userGroups, permissions);
        if (!userAuthorized) {
            httpService.forwardOnForbidden(httpRequest, httpResponse);
            return false;
        }
        return true;
    }

    private Set<String> getUserGroups(SlingHttpServletRequest httpRequest, HttpServletResponse httpResponse,
            String token) throws IOException, ServletException {
        try {
            return validator.getUserGroupsByToken(token);
        } catch (TokenException e) {
            LOG.warn("Invalid token '{}'", e);
            httpService.removeSecurityTokenFromCookie(httpResponse);
            String msgCode = e.getMessage();
            httpService.redirectToLogin(httpRequest, httpResponse, msgCode);
            return Collections.emptySet();
        } catch (ServiceUnavailableException e) {
            LOG.warn("Token validation service unavailable", e);
            httpService.forwardOnErrorPage(httpRequest, httpResponse);
            return Collections.emptySet();
            //NOSONAR
        } catch (RuntimeException e) {//NOSONAR
            LOG.error("Unexpected error during token validation", e);
            httpService.forwardOnErrorPage(httpRequest, httpResponse);
            return Collections.emptySet();
        }
    }

    @Override
    public void destroy() {
        LOG.info("destroy SecurityFilter");
    }
}