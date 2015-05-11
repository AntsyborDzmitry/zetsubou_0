package com.zetsubou_0.pattern.headfirst.decorator.starbuzz.beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public abstract class Beverage {
    protected String description;

    public String getDescription() {
        return description;
    }

    @Override public String toString() {
        return getDescription() + " $" + getCost();
    }

    public abstract double getCost();
}
