package com.zetsubou_0.osgi.test.client.activator;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class TestActivator implements BundleActivator {
    @Override
    public void start(BundleContext bundleContext) throws Exception {
        Bundle bundle = bundleContext.getBundle();
        StringBuilder sb = new StringBuilder();
        sb.append(bundle.getSymbolicName());
        sb.append(" (");
        sb.append(bundle.getVersion());
        sb.append(") started.");
        System.out.println(sb.toString());
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        Bundle bundle = bundleContext.getBundle();
        StringBuilder sb = new StringBuilder();
        sb.append(bundle.getSymbolicName());
        sb.append(" (");
        sb.append(bundle.getVersion());
        sb.append(") stopped.");
        System.out.println(sb.toString());
    }
}
