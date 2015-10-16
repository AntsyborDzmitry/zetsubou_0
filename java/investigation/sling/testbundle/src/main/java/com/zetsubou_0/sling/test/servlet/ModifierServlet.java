package com.zetsubou_0.sling.test.servlet;

import org.apache.commons.lang3.StringUtils;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ModifyingResourceProvider;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * Created by Kiryl_Lutsyk on 10/16/2015.
 */
@SlingServlet(
        extensions = {"edit"},
        selectors = {
                ModifierServlet.CREATE,
                ModifierServlet.DELETE,
                ModifierServlet.COMMIT,
                ModifierServlet.REVERT
        },
        resourceTypes = {"sling/servlet/default"}
)
public class ModifierServlet extends SlingAllMethodsServlet {
    public static final String CREATE = "createResource";
    public static final String DELETE = "deleteResource";
    public static final String COMMIT = "commitResource";
    public static final String REVERT = "revertResource";

    @Reference(target = "(custom.modifier=FsResourceModifier)")
    private ModifyingResourceProvider modifyingResourceProvider;

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try(PrintWriter out = response.getWriter()) {
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            RequestPathInfo requestPathInfo = request.getRequestPathInfo();
            String path = requestPathInfo.getSuffix();
            if(StringUtils.isNotBlank(path)) {
                for(String selector : requestPathInfo.getSelectors()) {
                    if(CREATE.equals(selector)) {
                        out.println("Resource created: " + modifyingResourceProvider.create(resourceResolver, path, null));
                    } else if(DELETE.equals(selector)) {
                        modifyingResourceProvider.delete(resourceResolver, path);
                        out.println("Resource deleted: " + path);
                    } else if(COMMIT.equals(selector)) {
                        modifyingResourceProvider.commit(resourceResolver);
                        out.println("All changes were committed");
                    } else if(REVERT.equals(selector)) {
                        modifyingResourceProvider.revert(resourceResolver);
                        out.println("All changes were reverted");
                    }
                }
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }
    }
}