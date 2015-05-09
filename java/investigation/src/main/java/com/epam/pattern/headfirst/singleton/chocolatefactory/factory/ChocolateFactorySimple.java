package com.epam.pattern.headfirst.singleton.chocolatefactory.factory;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class ChocolateFactorySimple {
    private static ChocolateFactorySimple factory;

    private ChocolateFactorySimple() {
    }

    public static ChocolateFactorySimple getInstance() {
        if(factory == null) {
            factory = new ChocolateFactorySimple();
        }
        return factory;
    }
}
