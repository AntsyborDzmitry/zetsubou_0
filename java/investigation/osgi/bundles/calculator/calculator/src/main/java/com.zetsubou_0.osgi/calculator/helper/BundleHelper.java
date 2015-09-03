package com.zetsubou_0.osgi.calculator.helper;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class BundleHelper {
    public static void printInformation(BundleContext bundleContext, String action) {
        Bundle bundle = bundleContext.getBundle();
        StringBuilder sb = new StringBuilder();
        sb.append(bundle.getSymbolicName());
        sb.append(" (");
        sb.append(bundle.getVersion());
        sb.append(") was ");
        sb.append(action);
        sb.append("\n");
        System.out.printf(sb.toString());
    }

}
