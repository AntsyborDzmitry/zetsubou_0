package com.zetsubou_0.pattern.headfirst.singleton.chocolatefactory.factory;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class ChocolateFactoryStatic {
    private static ChocolateFactoryStatic factory = new ChocolateFactoryStatic();

    private ChocolateFactoryStatic() {
    }

    public static ChocolateFactoryStatic getInstance() {
        return factory;
    }
}
