package com.zetsubou_0.osgi.calculator.bundles.activator;

import com.zetsubou_0.osgi.calculator.core.CalculatorThread;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorActivator implements BundleActivator {
    private CalculatorThread calculator;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        BundleHelper.printInformation(bundleContext, "added to container");
        calculator = new CalculatorThread(bundleContext);
        new Thread(calculator).start();
        System.out.println("Calculator started");
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        BundleHelper.printInformation(bundleContext, "removed from container");
        System.out.println("Calculator was closed");
    }
}
