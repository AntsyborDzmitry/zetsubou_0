package com.dhl.author.osgi;

import org.codehaus.jackson.jaxrs.JacksonJaxbJsonProvider;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

import java.util.Dictionary;
import java.util.Properties;


public class Activator  implements BundleActivator {
    /**
     * Overrides start method behaviour
     */
    @Override
    public void start(BundleContext bundleContext) {
        registerJacksonProvider(bundleContext);
    }

    /**
     * Overrides stop method behaviour
     */
    @Override
    public void stop(BundleContext bundleContext) {
        // There is nothing to do on stop
    }

    private void registerJacksonProvider(BundleContext context) {
        Dictionary<Object, Object> properties = new Properties();
        properties.put("javax.ws.rs", true);
        context.registerService(Object.class.getName(), new JacksonJaxbJsonProvider(), properties);
    }
}
