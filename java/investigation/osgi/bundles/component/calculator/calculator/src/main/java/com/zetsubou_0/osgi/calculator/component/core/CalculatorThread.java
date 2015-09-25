package com.zetsubou_0.osgi.calculator.component.core;

import com.zetsubou_0.osgi.api.observer.Listener;
import com.zetsubou_0.osgi.api.ui.CalculatorUI;
import com.zetsubou_0.osgi.calculator.component.api.CalculatorThreadStore;
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
    private CalculatorThreadStore calculatorThreadStore;
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
                calculatorThreadStore.getTracker().stopTracking();
                new Thread(new CalculatorThreadKiller(bundleContext)).run();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private void init() {
        calculatorThreadStore.getTracker().startTracking();
        calculatorThreadStore.getTracker().addListenr(listener);
        new Thread(window).start();
    }
}
