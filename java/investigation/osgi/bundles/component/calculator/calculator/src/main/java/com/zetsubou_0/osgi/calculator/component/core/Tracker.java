package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.observer.Handler;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.calculator.component.api.BundleContextProvider;
import com.zetsubou_0.osgi.calculator.component.api.DisableListeners;
import com.zetsubou_0.osgi.calculator.component.api.Tracking;
import com.zetsubou_0.osgi.calculator.component.helper.BundleHelper;
import org.apache.felix.scr.annotations.*;
import org.osgi.framework.Bundle;

import java.util.*;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
@Component
@Service(value = {Handler.class, Tracking.class, DisableListeners.class})
public class Tracker implements Handler, DisableListeners, Tracking {
    private boolean isTracked = false;
    private Set<Bundle> cache = new HashSet<>();
    private Set<Listener> listeners = new HashSet<>();
    @Reference
    private BundleContextProvider bundleContextProvider;
    @Reference(cardinality = ReferenceCardinality.OPTIONAL_MULTIPLE, policy = ReferencePolicy.DYNAMIC,
            referenceInterface = Operation.class, bind = "bind", unbind = "unbind")
    private List<Operation> operations;

    public Tracker() {}

    protected void bind(Operation operation) {
        if(operations == null) {
            operations = new ArrayList<>();
        }
        operations.add(operation);
        cache.add(BundleHelper.getOperationBundle(bundleContextProvider.getBundleContext(), operation));
        notifyAllListeners();
    }

    protected void unbind(Operation operation) {
        operations.remove(operation);
        cache.remove(BundleHelper.getOperationBundle(bundleContextProvider.getBundleContext(), operation));
        notifyAllListeners();
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

    @Override
    public void disable() {
        listeners = new HashSet<>();
    }
}
