package com.zetsubou_0.osgi.figure;

import com.zetsubou_0.osgi.api.paint.Figure;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

import java.util.Dictionary;
import java.util.Hashtable;
import java.util.ResourceBundle;

/**
 * Created by Kiryl_Lutsyk on 9/14/2015.
 */
public class ShapeActivator implements BundleActivator {
    private static final String SHAPE_NAME = "ShapeName";

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        Bundle bundle = bundleContext.getBundle();
        ResourceBundle resourceBundle = ResourceBundle.getBundle("Localize");
        Dictionary<String, Object> dictionary = new Hashtable<>();
        dictionary.put(Figure.NAME, resourceBundle.getString(SHAPE_NAME));
        bundleContext.registerService(Figure.class, new Shape(), dictionary);
        System.out.println(bundle.getSymbolicName() + " was added into container.");
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {

    }
}
