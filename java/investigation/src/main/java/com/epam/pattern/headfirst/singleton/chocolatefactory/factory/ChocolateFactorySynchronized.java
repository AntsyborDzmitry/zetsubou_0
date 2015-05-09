package com.epam.pattern.headfirst.singleton.chocolatefactory.factory;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class ChocolateFactorySynchronized {
    private static ChocolateFactorySynchronized factory;

    private ChocolateFactorySynchronized() {
    }

    public static synchronized ChocolateFactorySynchronized getInstance() {
        if(factory == null) {
            factory = new ChocolateFactorySynchronized();
        }
        return factory;
    }
}
