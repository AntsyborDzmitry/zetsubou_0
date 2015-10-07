package com.zetsubou_0.sling.test.servlets;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Iterator;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        methods = "GET",
        extensions = "html",
        selectors = "test"
)
public class ModifyingResourceProviderServlet extends SlingAllMethodsServlet {
    @Reference(target = "(" + CustomSlingConstants.MODIFYING_RESOURCE_PROVIDER_NAME + "=" + CustomSlingConstants.CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME + ")")
    private ModifyingResourceProvider modifyingResourceProvider;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        PrintWriter writer = response.getWriter();
        ResourceResolver resourceResolver = request.getResourceResolver();
        Resource resource = modifyingResourceProvider.getResource(resourceResolver, "toDelete");
        writer.println("Resource: " + resource);
        writer.println("Children: ");
        Iterator<Resource> iterator = resource.getChildren().iterator();
        while(iterator.hasNext()) {
            writer.append(iterator.next().toString());
        }
    }
}
