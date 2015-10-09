package com.zetsubou_0.sling.test.servlets;

import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomFsResource;
import com.zetsubou_0.sling.test.modifyingresourceprovider.CustomSlingConstants;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by Kiryl_Lutsyk on 10/7/2015.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        methods = "GET",
        extensions = ModifyingResourceProviderServlet.EXT,
        selectors = ModifyingResourceProviderServlet.SELECTOR
)
public class ModifyingResourceProviderServlet extends SlingAllMethodsServlet {
    public static final String EXT = "test";
    public static final String SELECTOR = "job";
    public static final String SELECTOR_DELETE = "delete";

    @Reference(target = "(" + CustomSlingConstants.MODIFYING_RESOURCE_PROVIDER_NAME + "=" + CustomSlingConstants.CUSTOM_MODIFYING_RESOURCE_PROVIDER_NAME + ")")
    private ModifyingResourceProvider modifyingResourceProvider;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        RequestPathInfo requestPathInfo = request.getRequestPathInfo();
        for(String selector : requestPathInfo.getSelectors()) {
            if(SELECTOR_DELETE.equals(selector)) {
                Resource resource = requestPathInfo.getSuffixResource();
                modifyingResourceProvider.delete(request.getResourceResolver(), resource.getPath());
            }
        }
    }
}
