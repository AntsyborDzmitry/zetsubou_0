package com.zetsubou_0.osgi.calculator.bundles.activator;

import com.zetsubou_0.osgi.calculator.core.CalculatorAction;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorActivator implements BundleActivator {
    private CalculatorAction calculator;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        BundleHelper.printInformation(bundleContext, "added to container");
        calculator = new CalculatorAction(bundleContext);
        calculator.setOut(System.out);
        new Thread(calculator).start();
        System.out.println("Calculator started");
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        BundleHelper.printInformation(bundleContext, "removed from container");
        calculator.exit();
        System.out.println("Calculator stopped");
    }
}
