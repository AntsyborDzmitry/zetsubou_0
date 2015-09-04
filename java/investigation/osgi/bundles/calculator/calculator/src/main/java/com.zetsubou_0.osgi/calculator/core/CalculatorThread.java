package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import com.zetsubou_0.osgi.calculator.observer.BundleTracker;
import com.zetsubou_0.osgi.calculator.ui.Window;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleException;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorThread implements Runnable {
    private BundleContext bundleContext;
    private BundleTracker bundleTracker;
    private Window window;

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

    public List<String> getOperations() {
        return BundleHelper.getHeader(bundleTracker.getCache(), Operation.OPERATION_NAME);
    }

    public void exit() {
        synchronized (CalculatorThread.class) {
            System.out.println("Calculator closing...");
            bundleTracker.stopTracking();
            CalculatorThread.class.notifyAll();
        }
    }

    public void uploadBundle(String path) throws BundleException {
        Bundle bundle = bundleContext.installBundle("file:" + path);
        bundle.start();
    }

    public void uninstallBundle(List<String> operations) throws BundleException {
        for(Bundle bundle : bundleTracker.getCache()) {
            for(String operation : operations) {
                if(operation.equals(BundleHelper.getHeader(bundle, Operation.OPERATION_NAME))) {
                    bundle.uninstall();
                }
            }
        }
    }

    private void init() {
        bundleTracker.startTracking();
        window = new Window(this);
        bundleTracker.addListenr(window);
        new Thread(window).start();
    }
}
