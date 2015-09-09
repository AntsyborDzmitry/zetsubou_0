package com.zetsubou_0.osgi.animal;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;

/**
 * Created by Kiryl_Lutsyk on 9/9/2015.
 */
public class Activator implements BundleActivator {
    @Override
    public void start(BundleContext bundleContext) throws Exception {
        Cat cat = new Cat();
        cat.who();
        Dog dog = new Dog();
        dog.who();
    }

    @Override
    public void stop(BundleContext bundleContext) throws Exception {

    }
}
