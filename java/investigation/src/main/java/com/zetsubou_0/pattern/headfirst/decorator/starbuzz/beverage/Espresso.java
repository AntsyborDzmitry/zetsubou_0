package com.zetsubou_0.pattern.headfirst.decorator.starbuzz.beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class Espresso extends Beverage {
    public Espresso() {
        description = "Espresso";
    }

    @Override public double getCost() {
        return 1.99;
    }
}
