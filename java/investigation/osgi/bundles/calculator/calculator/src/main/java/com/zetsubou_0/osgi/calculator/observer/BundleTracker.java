package com.zetsubou_0.osgi.calculator.observer;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.observer.BundleUpdateHandler;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.SynchronousBundleListener;

import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class BundleTracker implements BundleUpdateHandler {
    private BundleContext bundleContext;
    private SynchronousBundleListener listener;
    private boolean isTracked;
    private Set<Bundle> cache;
    private Set<Listener> listeners = new HashSet<>();

    public BundleTracker(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
        this.cache = new HashSet<>();
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
                            notifyAllListeners();
                        }
                    } else if(bundleEvent.getType() == BundleEvent.STOPPING) {
                        cache.remove(bundleEvent.getBundle());
                        notifyAllListeners();
                    }
                }
            }
        };
    }

    public void startTracking() {
        isTracked = true;
        bundleContext.addBundleListener(listener);
        for(Bundle bundle : bundleContext.getBundles()) {
            if(isValid(bundle)) {
                cache.add(bundle);
            }
        }
    }

    public void stopTracking() {
        isTracked = false;
        bundleContext.removeBundleListener(listener);
    }

    public Set<Bundle> getCache() {
        return cache;
    }

    @Override
    public void addListenr(Listener listener) {
        listeners.add(listener);
    }

    @Override
    public void removeListener(Listener listener) {
        listeners.remove(listener);
    }

    @Override
    public void notifyAllListeners() {
        for(Listener lister : listeners) {
            lister.perform();
        }
    }

    private boolean isValid(Bundle bundle) {
        String baseClass = BundleHelper.getHeader(bundle, Operation.OPERATION_BASE_CLASS);
        return baseClass != null && Operation.class.getCanonicalName().equals(baseClass) && !cache.contains(bundle);
    }
}
