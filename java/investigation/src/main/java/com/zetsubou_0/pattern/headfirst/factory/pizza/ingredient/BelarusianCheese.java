package com.zetsubou_0.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class BelarusianCheese implements Cheese {
    @Override
    public Cheese getCheese() {
        return this;
    }
}
