package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.component.observer.BundleTracker;
import com.zetsubou_0.osgi.calculator.component.ui.AbstractUI;
import com.zetsubou_0.osgi.calculator.component.ui.Window;
import org.apache.felix.scr.annotations.*;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
@Component
@Service(value = Runnable.class)
@Properties(
        @Property(name = CalculatorThread.TYPE, value = CalculatorThread.DEFAULT_TYPE))
public class CalculatorThread implements Runnable {
    public static final String DEFAULT_TYPE = "calculator";
    public static final String TYPE = "type";

    private BundleContext bundleContext;
    private BundleTracker bundleTracker;

    public CalculatorThread() {
    }

    protected void activate(ComponentContext componentContext) {
        this.bundleContext = componentContext.getBundleContext();
        this.bundleTracker = new BundleTracker(bundleContext);
    }

    @Override
    public void run() {
        init();
        synchronized (CalculatorThread.class) {
            try {
                CalculatorThread.class.wait();
                bundleTracker.stopTracking();
                new Thread(new CalculatorThreadKiller(bundleContext)).run();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public double calculate(String input) throws OperationException {
        Calculator calculator = new Calculator(bundleTracker.getCache());
        return calculator.calculate(input);
    }

    public BundleContext getBundleContext() {
        return bundleContext;
    }

    public BundleTracker getBundleTracker() {
        return bundleTracker;
    }

    private void init() {
        bundleTracker.startTracking();
        AbstractUI window = new Window(this);
        bundleTracker.addListenr(window);
        new Thread(window).start();
    }
}
