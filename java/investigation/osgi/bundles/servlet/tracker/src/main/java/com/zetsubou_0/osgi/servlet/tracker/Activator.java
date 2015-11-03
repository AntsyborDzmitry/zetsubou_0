package com.zetsubou_0.osgi.servlet.tracker;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;
import org.osgi.service.http.HttpService;

import javax.servlet.Servlet;
import java.util.Dictionary;

/**
 * Created by Kiryl_Lutsyk on 11/2/2015.
 */
public class Activator implements BundleActivator {
    private HttpService httpService;
    private String path;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        ServiceReference reference = bundleContext.getServiceReference("org.osgi.service.http.HttpService");
        Dictionary<String, String> headers = bundleContext.getBundle().getHeaders();
        httpService = (HttpService) bundleContext.getService(reference);
        path = headers.get("Servlet-Path");
        if (httpService != null && path != null) {
            Servlet servlet = new CustomServlet();
            httpService.registerServlet(path, servlet, null, null);
            System.out.println("OK");
        }
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        if (httpService != null) {
            httpService.unregister(path);
        }
    }
}
