package com.zetsubou_0.osgi.calculator.helper;

import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;

import java.util.ArrayList;
import java.util.Dictionary;
import java.util.List;
import java.util.Set;

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

    public static String getHeader(Bundle bundle, String key) {
        Dictionary<String, String> headers = bundle.getHeaders();
        return headers.get(key);
    }

    public static List<String> getHeader(Set<Bundle> bundles, String key) {
        List<String> headers = new ArrayList<>();
        for(Bundle bundle : bundles) {
            String header = getHeader(bundle, key);
            if(header != null) {
                headers.add(header);
            }
        }
        return headers;
    }

    public static Bundle getBundleByHeader(Set<Bundle> bundles, String key, String value) {
        for(Bundle bundle : bundles) {
            if(value != null && value.equals(getHeader(bundle, key))) {
                return bundle;
            }
        }
        return null;
    }
}
