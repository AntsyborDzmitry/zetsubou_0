package com.epam.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class EnglishCheese implements Cheese {
    @Override public Cheese getCheese() {
        return this;
    }
}
