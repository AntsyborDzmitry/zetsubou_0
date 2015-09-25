package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.component.api.CalculatorThreadStore;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
@Component
@Service(value = CalculatorThreadStore.class)
public class CalculatorThreadStoreImpl implements CalculatorThreadStore {
    private BundleContext bundleContext;
    private Tracker tracker;

    @Activate
    protected void activate(ComponentContext componentContext) {
        this.bundleContext = componentContext.getBundleContext();
        this.tracker = new Tracker();
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
    public Tracker getTracker() {
        return tracker;
    }
}
