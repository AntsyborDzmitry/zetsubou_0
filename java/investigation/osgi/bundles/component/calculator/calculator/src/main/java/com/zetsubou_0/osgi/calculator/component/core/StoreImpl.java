package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.api.observer.Handler;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.calculator.component.api.BundleContextProvider;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import com.zetsubou_0.osgi.calculator.component.api.Tracking;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
@Component
@Service(value = Store.class)
public class StoreImpl implements Store {
    @Reference
    private BundleContextProvider bundleContextProvider;
    @Reference
    private Tracking tracker;
    @Reference
    private Handler handler;

    @Override
    public double calculate(String input) throws OperationException {
        Calculator calculator = new Calculator(tracker.getCache());
        return calculator.calculate(input);
    }

    @Override
    public BundleContext getBundleContext() {
        return bundleContextProvider.getBundleContext();
    }

    @Override
    public Tracking getTracker() {
        return tracker;
    }

    @Override
    public void addListener(Listener listener) {
        handler.addListenr(listener);
    }
}
