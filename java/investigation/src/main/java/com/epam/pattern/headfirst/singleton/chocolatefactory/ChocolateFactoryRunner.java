package com.epam.pattern.headfirst.singleton.chocolatefactory;

import com.epam.pattern.headfirst.singleton.chocolatefactory.factory.ChocolateFactorySimple;
import com.epam.pattern.headfirst.singleton.chocolatefactory.factory.ChocolateFactoryStatic;
import com.epam.pattern.headfirst.singleton.chocolatefactory.factory.ChocolateFactorySynchronized;
import com.epam.pattern.headfirst.singleton.chocolatefactory.factory.ChocolateFactoryVolatile;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 *
 * The Singleton Pattern ensures a class has only one
 * instance, and provides a global point of access to it.
 *
 */
public class ChocolateFactoryRunner {
    public static void main(String[] args) {
        System.out.println(ChocolateFactorySimple.getInstance() == ChocolateFactorySimple.getInstance());
        System.out.println(ChocolateFactoryStatic.getInstance() == ChocolateFactoryStatic.getInstance());
        System.out.println(ChocolateFactoryVolatile.getInstance() == ChocolateFactoryVolatile.getInstance());
        System.out.println(ChocolateFactorySynchronized.getInstance() == ChocolateFactorySynchronized.getInstance());
    }
}
