package com.epam.pattern.headfirst.decorator.starbuzz.decorator;

import com.epam.pattern.headfirst.decorator.starbuzz.beverage.Beverage;
import com.epam.pattern.headfirst.decorator.starbuzz.decorator.CondimentDecorator;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class Whip extends CondimentDecorator {
    public Whip(Beverage beverage) {
        super(beverage);
    }

    @Override public String getDescription() {
        return beverage.getDescription() + ", Whip";
    }

    @Override public double getCost() {
        return beverage.getCost() + 0.12;
    }
}
