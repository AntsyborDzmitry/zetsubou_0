package com.zetsubou_0.osgi.calculator.observer;

import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class BundleTrackerFactory {
    private static BundleTracker bundleTracker;

    public static BundleTracker getInstance(BundleContext bundleContext) {
        synchronized(BundleTrackerFactory.class) {
            if(bundleTracker == null) {
                bundleTracker = new BundleTracker(bundleContext);
            }
            return bundleTracker;
        }
    }
}
