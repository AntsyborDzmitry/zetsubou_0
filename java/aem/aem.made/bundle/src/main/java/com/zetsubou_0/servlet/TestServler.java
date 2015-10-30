package com.zetsubou_0.servlet;

import com.zetsubou_0.model.PersonModel;
import org.apache.felix.scr.annotations.sling.SlingServlet;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;

import javax.servlet.ServletException;
import java.io.IOException;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
@SlingServlet(
        resourceTypes = "sling/servlet/default",
        paths = "/content/qwe"
)
public class TestServler extends SlingAllMethodsServlet {
    @Override
    protected void doGet(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        Resource resource = request.getRequestPathInfo().getSuffixResource();
        if (resource != null) {
            PersonModel person = resource.adaptTo(PersonModel.class);
            response.getWriter().print(person);
        }
    }
}
