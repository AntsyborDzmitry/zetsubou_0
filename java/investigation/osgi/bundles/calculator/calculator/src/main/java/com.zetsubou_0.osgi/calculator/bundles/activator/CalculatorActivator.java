package com.zetsubou_0.osgi.calculator.bundles.activator;

import com.zetsubou_0.osgi.calculator.core.CalculatorShell;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import com.zetsubou_0.osgi.calculator.ui.TextAreaOutputStream;
import com.zetsubou_0.osgi.calculator.ui.Window;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CalculatorActivator implements BundleActivator {
    private CalculatorShell calculator;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        BundleHelper.printInformation(bundleContext, "added to container");
//        Window window = new Window();
//        PrintStream out = new PrintStream(new TextAreaOutputStream(window.getTextArea()));
        calculator = new CalculatorShell(bundleContext);
//        calculator.setOut(out);
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
