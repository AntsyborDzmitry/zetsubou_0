package com.zetsubou_0.aem.training.services.rest;

import com.zetsubou_0.aem.training.sling.model.TestModel;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;
import java.io.PrintWriter;

@SlingServlet(paths = "/bin/aem/training/test")
public class SimpleTestServlet extends SlingSafeMethodsServlet {

    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response)
            throws ServletException, IOException {
        Resource resource = request.getRequestPathInfo().getSuffixResource();
        PrintWriter writer = response.getWriter();
        if (resource == null) {
            writer.println("Resource is null");
            return;
        }
        TestModel testModel = resource.adaptTo(TestModel.class);
        if (testModel == null) {
            writer.println("Model is null");
            return;
        }
        writer.println("I'm working." + "Type: " + testModel.getType());
    }
}
