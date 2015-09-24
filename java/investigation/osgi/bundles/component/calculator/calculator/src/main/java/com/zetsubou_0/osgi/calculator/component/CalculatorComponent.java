package com.zetsubou_0.osgi.calculator.component;

import com.zetsubou_0.osgi.calculator.component.helper.BundleHelper;
import org.apache.felix.scr.annotations.Activate;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Deactivate;
import org.apache.felix.scr.annotations.Reference;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/23/2015.
 */
@Component(immediate = true)
public class CalculatorComponent {
    @Reference(target = "(type=calculator)")
    private Runnable calculator;

    public CalculatorComponent() {
    }

    @Activate
    protected void start(ComponentContext componentContext) {
        BundleHelper.printInformation(componentContext.getBundleContext(), "added to container");
        new Thread(calculator).start();
        System.out.println("Calculator started");
    }

    @Deactivate
    protected void stop(ComponentContext componentContext) {
        BundleHelper.printInformation(componentContext.getBundleContext(), "removed from container");
        System.out.println("Calculator was closed");
    }
}
