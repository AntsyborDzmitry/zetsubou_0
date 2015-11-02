package com.zetsubou_0.sling.test.servlet;

import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.adapter.AdapterManager;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.OutputStream;

/**
 * Created by Kiryl_Lutsyk on 11/2/2015.
 */
@SlingServlet(
        extensions = {"cast"},
        selectors = {"out"},
        resourceTypes = {"sling/servlet/default"}
)
public class CastServlet extends SlingAllMethodsServlet {
    @Reference
    private AdapterManager adapterManager;

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        Resource resource = request.getResource();
        if (resource != null) {
            OutputStream out = adapterManager.getAdapter(resource, OutputStream.class);
            response.getWriter().println(out);
            if (out != null) {
                out.close();
            }
        }
    }
}
