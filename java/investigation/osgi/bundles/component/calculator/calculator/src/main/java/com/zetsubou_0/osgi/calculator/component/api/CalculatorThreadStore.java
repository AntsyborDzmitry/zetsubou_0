package com.zetsubou_0.osgi.calculator.component.api;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.component.core.Tracker;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
public interface CalculatorThreadStore {
    double calculate(String input) throws OperationException;
    BundleContext getBundleContext();
    Tracker getTracker();
}
