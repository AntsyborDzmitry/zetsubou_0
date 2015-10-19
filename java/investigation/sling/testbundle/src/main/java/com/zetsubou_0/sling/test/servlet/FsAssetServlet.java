package com.zetsubou_0.sling.test.servlet;

import com.day.cq.dam.api.Asset;
import com.day.cq.dam.api.AssetManager;
import com.zetsubou_0.sling.test.bean.FsResource;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.ReferencePolicy;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.request.RequestPathInfo;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * Created by Kiryl_Lutsyk on 10/19/2015.
 */
@SlingServlet(
        extensions = {"asset"},
        selectors = {
                FsAssetServlet.TEST
        },
        resourceTypes = {"sling/servlet/default"}
)
public class FsAssetServlet extends SlingAllMethodsServlet {
    public static final String TEST = "test";

    @Reference(cardinality = ReferenceCardinality.OPTIONAL_UNARY, policy = ReferencePolicy.DYNAMIC)
    private ResourceResolverFactory resourceResolverFactory;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        try (PrintWriter out = response.getWriter()) {
            ResourceResolver resourceResolver = resourceResolverFactory.getAdministrativeResourceResolver(null);
            RequestPathInfo requestPathInfo = request.getRequestPathInfo();
            for (String selector : requestPathInfo.getSelectors()) {
                if (TEST.equals(selector)) {
                    FsResource resource = (FsResource) requestPathInfo.getSuffixResource();
                    if(resource != null) {
                        AssetManager assetManager = resourceResolver.adaptTo(AssetManager.class);
                        Asset asset = assetManager.createAsset(request.getResource().getPath() + "/" + resource.getName(), resource.adaptTo(InputStream.class), resource.getMimeType(), false);
                        out.println(asset);

                    }
                }
            }
        } catch (Exception e) {
            throw new ServletException(e);
        }

    }

}
