package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.observer.BundleTracker;
import com.zetsubou_0.osgi.calculator.ui.Window;
import org.osgi.framework.BundleContext;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorAction implements Runnable {
    private PrintStream out;
    private BundleTracker bundleTracker;
    private Window window;

    private CalculatorAction() {}

    public CalculatorAction(BundleContext bundleContext) {
        this.bundleTracker = new BundleTracker(bundleContext);
    }

    @Override
    public void run() {
        init();
        synchronized (CalculatorAction.class) {
            try {
                CalculatorAction.class.wait();
                out.println("Process stopped.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public double calculate(String input) throws OperationException {
        Calculator calculator = new Calculator(bundleTracker.getCache());
        return calculator.calculate(input);
    }

    public void exit() {
        synchronized (CalculatorAction.class) {
            bundleTracker.stopTracking();
            CalculatorAction.class.notifyAll();
        }
    }

    public void setOut(PrintStream out) {
        this.out = out;
    }

    private void init() {
        bundleTracker.startTracking();
        window = new Window(this);
    }
}
