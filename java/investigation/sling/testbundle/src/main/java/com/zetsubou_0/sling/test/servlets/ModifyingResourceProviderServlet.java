package com.zetsubou_0.sling.test.servlets;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import com.zetsubou_0.sling.test.modifyingresourceprovider.monitor.CustomFsMonitor;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.event.EventAdmin;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        methods = "GET",
        extensions = "test",
        selectors = "job"
)
public class ModifyingResourceProviderServlet extends SlingAllMethodsServlet {
    @Reference(target = "(" + CustomSlingConstants.MODIFYING_RESOURCE_PROVIDER_NAME + "=" + CustomSlingConstants.CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME + ")")
    private ModifyingResourceProvider modifyingResourceProvider;
    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy= ReferencePolicy.DYNAMIC)
    private EventAdmin eventAdmin;
    @Reference(cardinality= ReferenceCardinality.OPTIONAL_UNARY, policy=ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        ResourceResolver resourceResolver = null;
        try {
//            resourceResolver = request.getResourceResolver();
            resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            CustomFsMonitor customFsMonitor = new CustomFsMonitor(eventAdmin, resourceResolver, modifyingResourceProvider);
            new Thread(customFsMonitor).start();
        } catch (LoginException e) {
            throw new ServletException(e);
        }
    }
}
