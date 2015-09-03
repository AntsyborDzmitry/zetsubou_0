package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.calculator.observer.BundleTracker;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorShell implements Runnable {
    private PrintStream out;
    private BundleTracker bundleTracker;
    private Calculator calculator;

    private CalculatorShell() {}

    public CalculatorShell(BundleTracker bundleTracker) {
        this.bundleTracker = bundleTracker;
        calculator = new Calculator(bundleTracker.getCache());
    }

    @Override
    public void run() {
        init();
        synchronized (CalculatorShell.class) {
            try {
                CalculatorShell.class.wait();
                out.println("Process stopped.");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public void exit() {
        synchronized (CalculatorShell.class) {
            calculator.calculate("10 + (3 + 10.5)");
            bundleTracker.stopTracking();
            CalculatorShell.class.notifyAll();
        }
    }

    public void setOut(PrintStream out) {
        this.out = out;
    }

    private void init() {
        bundleTracker.startTracking();
    }
}
