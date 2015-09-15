package com.zetsubou_0.osgi.paint.bundles.listener;

import com.zetsubou_0.osgi.api.paint.Figure;
import com.zetsubou_0.osgi.api.paint.Paint;
import org.osgi.framework.BundleContext;
import org.osgi.framework.ServiceEvent;
import org.osgi.framework.ServiceListener;
import org.osgi.framework.ServiceReference;

/**
 * Created by Kiryl_Lutsyk on 9/14/2015.
 */
public class FigureListener implements ServiceListener {
    private BundleContext bundleContext;
    private Paint paint;

    public FigureListener(BundleContext bundleContext) {
        this.bundleContext = bundleContext;
    }

    @Override
    public void serviceChanged(ServiceEvent serviceEvent) {
        switch(serviceEvent.getType()) {
            case ServiceEvent.REGISTERED:
                Figure figure = (Figure) bundleContext.getService(serviceEvent.getServiceReference());
                addFigure(figure);
            case ServiceEvent.UNREGISTERING:

        }
    }

    private void addFigure(Figure figure) {
        synchronized(FigureListener.class) {
            if(paint == null) {
                initPaint();
            }
            if(paint != null) {
                paint.addFigure(figure);
                paint.printFiguresList();
            }
        }
    }

    private void removeFigure() {
        synchronized(Figure.class) {
            if(paint == null) {
                initPaint();
            }
            if(paint != null) {
                paint.printFiguresList();
            }
        }
    }

    private synchronized void initPaint() {
        ServiceReference reference = bundleContext.getServiceReference(Paint.class);
        if(reference != null) {
            this.paint = (Paint) bundleContext.getService(reference);
        }
    }
}
