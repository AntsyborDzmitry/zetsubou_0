package com.epam.pattern.headfirst.singleton.chocolatefactory.factory;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class ChocolateFactoryVolatile {
    private static volatile ChocolateFactoryVolatile factory;

    private ChocolateFactoryVolatile() {
    }

    public static ChocolateFactoryVolatile getInstance() {
        if(factory == null) {
            synchronized (ChocolateFactoryVolatile.class) {
                if(factory == null) {
                    factory = new ChocolateFactoryVolatile();
                }
            }
        }
        return factory;
    }
}
