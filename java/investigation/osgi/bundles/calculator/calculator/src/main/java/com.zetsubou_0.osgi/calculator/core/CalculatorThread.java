package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.observer.BundleTracker;
import com.zetsubou_0.osgi.calculator.ui.AbstractUI;
import com.zetsubou_0.osgi.calculator.ui.Window;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorThread implements Runnable {
    private BundleContext bundleContext;
    private BundleTracker bundleTracker;

    private CalculatorThread() {}

    public CalculatorThread(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
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
