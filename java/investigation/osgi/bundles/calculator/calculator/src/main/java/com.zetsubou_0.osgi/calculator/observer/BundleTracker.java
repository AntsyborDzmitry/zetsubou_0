package com.zetsubou_0.osgi.calculator.observer;

import com.zetsubou_0.osgi.api.Operation;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.SynchronousBundleListener;

import java.util.Dictionary;
import java.util.HashSet;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class BundleTracker {
    private final Set<Bundle> cache = new HashSet<>();
    private final BundleContext bundleContext;
    private SynchronousBundleListener listener;
    private boolean isTracked;

    public BundleTracker(final BundleContext bundleContext) {
        this.bundleContext = bundleContext;
        listener = new SynchronousBundleListener() {
            @Override
            public void bundleChanged(BundleEvent bundleEvent) {
                synchronized (BundleTracker.this) {
                    if(!isTracked) {
                        return;
                    }
                    Bundle bundle = bundleEvent.getBundle();
                    if(bundleEvent.getType() == BundleEvent.STARTED) {
                        if(isValid(bundle)) {
                            cache.add(bundleEvent.getBundle());
                        }
                    } else if(bundleEvent.getType() == BundleEvent.STOPPING) {
                        cache.remove(bundleEvent.getBundle());
                    }
                }
            }
        };
    }

    public void startTracking() {
        isTracked = true;
        for(Bundle bundle : bundleContext.getBundles()) {
            if(isValid(bundle)) {
                cache.add(bundle);
            }
        }
        bundleContext.addBundleListener(listener);
    }

    public void stopTracking() {
        isTracked = false;
        bundleContext.removeBundleListener(listener);
    }

    public Set<Bundle> getCache() {
        return cache;
    }

    private boolean isValid(Bundle bundle) {
        Dictionary<String, String> headers = bundle.getHeaders();
        String baseClass = headers.get(Operation.OPERATION_BASE_CLASS);
        return baseClass != null && Operation.class.getCanonicalName().equals(baseClass) && !cache.contains(bundle);
    }
}
