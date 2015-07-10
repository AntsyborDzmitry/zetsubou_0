package com.zetsubou_0.test.servlets;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.ServletResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by zetsubou_0 on 10.07.15.
 */
@SlingServlet(resourceTypes = {"sling/servlet/default"}, extensions = {"json"}, selectors = {"sponsoredDialog"})
public class DynamicDialog extends SlingAllMethodsServlet {
    private static final Logger LOGGER = LoggerFactory.getLogger(DynamicDialog.class);

    @Reference
    private ServletResolver servletResolver;

    @Reference
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try {
            String pageTemplate = getPageTemplate(request);
            Servlet servlet = servletResolver.resolveServlet(request.getResource(), "/apps/aem/components/page/emptypage/newTab.json.jsp");
            servlet.service(request, response);
        } catch (LoginException e) {
            LOGGER.error(e.getMessage(), e);
        } catch (RepositoryException e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    private String getPageTemplate(SlingHttpServletRequest request) throws LoginException, RepositoryException {
        String pageTemplate = null;
        ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
        String url = request.getHeader("referer");
        StringBuilder sb = new StringBuilder();
        sb.append("http[s]?://");
        sb.append(request.getRemoteHost());
        sb.append(":");
        sb.append(request.getServerPort());
        url = url.replaceAll(sb.toString(), StringUtils.EMPTY);
        String resourcePath = url.replaceAll("[.]html", StringUtils.EMPTY);
        Resource resource = resourceResolver.getResource(resourcePath + "/jcr:content");
        if(resource != null) {
            Node node = resource.adaptTo(Node.class);
            if(node != null) {
                Property property = node.getProperty("cq:template");
                if(property != null) {
                    pageTemplate = property.getString();
                }
            }
        }
        return pageTemplate;
    }
}
