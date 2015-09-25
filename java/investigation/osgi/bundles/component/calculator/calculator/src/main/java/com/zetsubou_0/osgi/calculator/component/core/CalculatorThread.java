package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.api.ui.CalculatorUI;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import com.zetsubou_0.osgi.calculator.component.api.ThreadKiller;
import org.apache.felix.scr.annotations.*;
import org.osgi.framework.BundleContext;
import org.osgi.service.component.ComponentContext;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
@Component(immediate = true)
@Properties(
        @Property(name = CalculatorThread.TYPE, value = CalculatorThread.DEFAULT_TYPE))
public class CalculatorThread implements Runnable {
    public static final String DEFAULT_TYPE = "calculator";
    public static final String TYPE = "type";

    @Reference
    private CalculatorUI window;
    @Reference
    private Listener listener;
    @Reference
    private Store store;
    @Reference
    private ThreadKiller threadKiller;
    private BundleContext bundleContext;

    public CalculatorThread() {
    }

    @Activate
    protected void activate(ComponentContext componentContext) {
        System.out.println("CC started.");
        this.bundleContext = componentContext.getBundleContext();
        new Thread(this).start();
    }

    @Deactivate
    protected void deactivate(ComponentContext componentContext) {
        System.out.println("CC stopped.");
    }

    @Override
    public void run() {
        init();
        synchronized (CalculatorThread.class) {
            try {
                CalculatorThread.class.wait();
                store.getTracker().stopTracking();
                threadKiller.setBundle(bundleContext.getBundle());
                new Thread(threadKiller).start();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void init() {
        store.getTracker().startTracking();
        store.addListener(listener);
        new Thread(window).start();
    }
}
