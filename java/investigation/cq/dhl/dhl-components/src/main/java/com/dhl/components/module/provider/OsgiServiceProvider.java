package com.dhl.components.module.provider;

import javax.inject.Inject;

import org.apache.commons.lang.Validate;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceReference;

import com.google.inject.Provider;

public class OsgiServiceProvider<T> implements Provider<T>{
    
    @Inject
    private BundleContext bundleContext;
    
    private Class<T> type;

    public OsgiServiceProvider(final Class<T> type) {
        Validate.notNull(type, "Type parameter should not be null!");
        this.type = type;
    }

    @SuppressWarnings("unchecked")
    public T getService(final Class<T> type) {
        ServiceReference ref = this.bundleContext.getServiceReference(type.getName());
        return ref != null ? (T) this.bundleContext.getService(ref) : null;
    }

    @Override
    public T get() {
        return getService(type);
    }
    
}