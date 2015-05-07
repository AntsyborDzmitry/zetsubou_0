package com.epam.pattern.headfirst.decorator.starbuzz;

import com.epam.pattern.headfirst.decorator.starbuzz.beverage.Beverage;
import com.epam.pattern.headfirst.decorator.starbuzz.beverage.Espresso;
import com.epam.pattern.headfirst.decorator.starbuzz.beverage.HouseBlend;
import com.epam.pattern.headfirst.decorator.starbuzz.decorator.Soy;
import com.epam.pattern.headfirst.decorator.starbuzz.decorator.Whip;
import com.epam.pattern.headfirst.decorator.starbuzz.decorator.Mocha;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 *
 * The Decorator Pattern attaches additional
 * responsibilities to an object dynamically.
 * Decorators provide a flexible alternative to
 * subclassing for extending functionality.
 *
 */
public class DecoratorRunner {
    public static void main(String[] args) {
        Beverage beverage1 = new Espresso();
        System.out.println(beverage1);

        Beverage beverage2 = new HouseBlend();
        beverage2 = new Mocha(beverage2);
        beverage2 = new Mocha(beverage2);
        beverage2 = new Soy(beverage2);
        System.out.println(beverage2);

        Beverage beverage3 = new Espresso();
        beverage3 = new Whip(beverage3);
        System.out.println(beverage3);
    }
}
