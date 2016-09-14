package com.zetsubou_0.rest;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.ReferenceCardinality;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.i18n.ResourceBundleProvider;

import javax.servlet.ServletException;
import java.io.IOException;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        selectors = "aem",
        extensions = "test"
)
public class TestServler extends SlingAllMethodsServlet {
    @Reference(cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE, bind = "bind", unbind = "unbind")
    ResourceBundleProvider resourceBundleProvider;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        ResourceBundle resourceBundle = resourceBundleProvider.getResourceBundle("ddd", new Locale("en"));
        response.getWriter().write(resourceBundle.getString("common.edit"));
    }

    protected void bind(ResourceBundleProvider resourceBundleProvider) {
        if (resourceBundleProvider.getClass().getName().endsWith("JcrResourceBundleProvider")) {
            this.resourceBundleProvider = resourceBundleProvider;
        }
    }

    protected void unbind(ResourceBundleProvider resourceBundleProvider) {
        this.resourceBundleProvider = null;
    }
}
