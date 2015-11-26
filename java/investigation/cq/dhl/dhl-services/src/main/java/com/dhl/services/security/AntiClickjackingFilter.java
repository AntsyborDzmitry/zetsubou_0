package com.dhl.services.security;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.sling.SlingFilter;
import org.apache.felix.scr.annotations.sling.SlingFilterScope;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;


@SlingFilter(generateComponent = false, generateService = true, order = 1, scope = SlingFilterScope.REQUEST)
@Component(immediate = true)
public class AntiClickjackingFilter implements javax.servlet.Filter {

    private static final String FRAME_OPTIONS_HEADER_NAME = "X-Frame-Options";
    private static final String FRAME_OPTIONS_HEADER_VALUE = "SAMEORIGIN";

    private static final Logger LOG = LoggerFactory.getLogger(AntiClickjackingFilter.class);

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.info("Init done");
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
                                                                                throws IOException, ServletException {
        LOG.debug("Setting '{}' header to '{}'", FRAME_OPTIONS_HEADER_NAME, FRAME_OPTIONS_HEADER_VALUE);
        ((HttpServletResponse)response).setHeader(FRAME_OPTIONS_HEADER_NAME, FRAME_OPTIONS_HEADER_VALUE);
        filterChain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        LOG.info("Destroy done");
    }
}
