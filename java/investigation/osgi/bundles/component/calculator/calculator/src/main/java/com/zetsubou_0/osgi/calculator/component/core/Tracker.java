package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.observer.Handler;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.calculator.component.api.Tracking;
import com.zetsubou_0.osgi.calculator.component.helper.BundleHelper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleEvent;
import org.osgi.framework.SynchronousBundleListener;
import org.osgi.service.component.ComponentContext;

import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
@Component
@Service(value = {Handler.class, Tracking.class})
public class Tracker implements Handler, Tracking {
    private boolean isTracked = false;
    private Set<Bundle> cache = new HashSet<>();
    private Set<Listener> listeners = new HashSet<>();

    public Tracker() {
//        listener = new SynchronousBundleListener() {
//            @Override
//            public void bundleChanged(BundleEvent bundleEvent) {
//                synchronized (Tracker.this) {
//                    if(!isTracked) {
//                        return;
//                    }
//                    Bundle bundle = bundleEvent.getBundle();
//                    if(bundleEvent.getType() == BundleEvent.STARTED) {
//                        if(isValid(bundle)) {
//                            cache.add(bundleEvent.getBundle());
//                            notifyAllListeners();
//                        }
//                    } else if(bundleEvent.getType() == BundleEvent.STOPPING) {
//                        cache.remove(bundleEvent.getBundle());
//                        notifyAllListeners();
//                    }
//                }
//            }
//        };
    }

    @Override
    public void startTracking() {
        isTracked = true;
    }

    @Override
    public void stopTracking() {
        isTracked = false;
    }

    @Override
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
