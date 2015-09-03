package com.zetsubou_0.osgi.calculator.observer;

import com.zetsubou_0.osgi.api.Operation;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.SynchronousBundleListener;

import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class BundleTracker {
    private final BundleContext bundleContext;
    private SynchronousBundleListener listener;
    private boolean isTracked;
    private Set<Bundle> cache;

    public BundleTracker(final BundleContext bundleContext) {
        this.bundleContext = bundleContext;
        this.cache = new TreeSet<>(new Comparator<Bundle>() {
            @Override
            public int compare(Bundle o1, Bundle o2) {
                Dictionary<String, String> headers = null;
                headers = o2.getHeaders();
                int r2 = Integer.parseInt(headers.get(Operation.OPERATION_RANK));
                headers = o1.getHeaders();
                int r1 = Integer.parseInt(headers.get(Operation.OPERATION_RANK));
                return r2 - r1;
            }
        });
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
