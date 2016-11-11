package com.zetsubou_0.aem.training.services.osgi;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Bundle activator for com.zetsubou_0.aem.training - training-services.
 */
public class Activator implements BundleActivator {

    private static final Logger LOG = LoggerFactory.getLogger(Activator.class);

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        LOG.info("Activate: " + bundleContext.getBundle().getSymbolicName());
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        LOG.info("Deactivate: " + bundleContext.getBundle().getSymbolicName());
    }
}
