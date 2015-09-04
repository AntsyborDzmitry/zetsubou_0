package com.zetsubou_0.osgi.calculator.core;

import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleException;

/**
 * Created by Kiryl_Lutsyk on 9/4/2015.
 */
public class CalculatorThreadKiller implements Runnable {
    private BundleContext bundleContext;

    private CalculatorThreadKiller() {}

    public CalculatorThreadKiller(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Override
    public void run() {
        try {
            bundleContext.getBundle().stop();
        } catch (BundleException e) {
            e.printStackTrace();
        }
    }
}
