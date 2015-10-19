package com.zetsubou_0.sling.test.servlet;

import com.zetsubou_0.sling.test.bean.FsResource;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;

/**
 * Created by Kiryl_Lutsyk on 10/16/2015.
 */
@SlingServlet(
        extensions = {"info"},
        selectors = {"fs"},
        resourceTypes = {"sling/servlet/default"}
)
public class FsResourceInfoServlet extends SlingAllMethodsServlet {
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        Resource resource = request.getResource();
        try(PrintWriter out = response.getWriter()) {
            out.println("Resource: " + resource);
            out.println("File: " + resource.adaptTo(File.class));
            out.println("Input stream: " + resource.adaptTo(InputStream.class));
        }
    }
}
