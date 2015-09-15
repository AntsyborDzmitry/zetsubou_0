package com.zetsubou_0.osgi.paint.bundles.activator;

import com.zetsubou_0.osgi.api.paint.Figure;
import com.zetsubou_0.osgi.api.paint.Paint;
import com.zetsubou_0.osgi.paint.PaintImpl;
import com.zetsubou_0.osgi.paint.bundles.listener.FigureListener;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.Constants;
import org.osgi.framework.ServiceListener;

import java.util.Hashtable;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class PaintActivator implements BundleActivator {
    private ServiceListener serviceListener;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        serviceListener = new FigureListener(bundleContext);
        StringBuilder filter = new StringBuilder();
        filter.append("(");
        filter.append(Constants.OBJECTCLASS);
        filter.append("=");
        filter.append(Figure.class.getName());
        filter.append(")");

        bundleContext.addServiceListener(serviceListener, filter.toString());
        bundleContext.registerService(Paint.class, new PaintImpl(), new Hashtable<String, Object>());
        System.out.println("Paint started");
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        bundleContext.removeServiceListener(serviceListener);
        System.out.println("Paint was closed");
    }
}
