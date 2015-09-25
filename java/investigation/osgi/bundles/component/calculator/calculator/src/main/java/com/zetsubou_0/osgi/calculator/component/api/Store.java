package com.zetsubou_0.osgi.calculator.component.api;

import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.api.observer.Listener;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/25/2015.
 */
public interface Store {
    double calculate(String input) throws OperationException;
    BundleContext getBundleContext();
    Tracking getTracker();
    void addListener(Listener listener);
}
