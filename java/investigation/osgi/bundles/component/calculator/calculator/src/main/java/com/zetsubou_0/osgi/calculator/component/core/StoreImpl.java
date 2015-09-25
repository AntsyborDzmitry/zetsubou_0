package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.api.observer.Handler;
import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import com.zetsubou_0.osgi.calculator.component.api.Tracking;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Reference;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
@Component
@Service(value = Store.class)
public class StoreImpl implements Store {
    private BundleContext bundleContext;
    @Reference
    private Tracking tracker;
    @Reference
    private Handler handler;

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.bundleContext = componentContext.getBundleContext();
    }

    @Override
    public double calculate(String input) throws OperationException {
        Calculator calculator = new Calculator(tracker.getCache());
        return calculator.calculate(input);
    }

    @Override
    public BundleContext getBundleContext() {
        return bundleContext;
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
