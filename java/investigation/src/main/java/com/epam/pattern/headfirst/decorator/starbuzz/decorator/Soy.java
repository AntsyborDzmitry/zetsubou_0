package com.epam.pattern.headfirst.decorator.starbuzz.decorator;

import com.epam.pattern.headfirst.decorator.starbuzz.beverage.Beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class Soy extends CondimentDecorator {
    public Soy(Beverage beverage) {
        super(beverage);
    }

    @Override public String getDescription() {
        return beverage.getDescription() + ", Soy";
    }

    @Override public double getCost() {
        return beverage.getCost() + 0.33;
    }
}
