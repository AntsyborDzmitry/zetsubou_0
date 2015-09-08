package com.zetsubou_0.osgi.console.activator;

import com.zetsubou_0.osgi.console.Console;
import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class ConsoleActivator implements BundleActivator {
    private Thread console;

    @Override
    public void start(BundleContext bundleContext) throws Exception {
        console = new Thread(new Console(System.out, System.in));
        console.start();
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {
        synchronized (Console.class) {
            Console.class.notifyAll();
        }
    }
}
