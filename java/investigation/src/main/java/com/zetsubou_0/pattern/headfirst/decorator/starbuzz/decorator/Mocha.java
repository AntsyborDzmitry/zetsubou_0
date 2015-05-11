package com.zetsubou_0.pattern.headfirst.decorator.starbuzz.decorator;

import com.zetsubou_0.pattern.headfirst.decorator.starbuzz.beverage.Beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class Mocha extends CondimentDecorator {
    public Mocha(Beverage beverage) {
        super(beverage);
    }

    @Override public String getDescription() {
        return beverage.getDescription() + ", Mocha";
    }

    @Override public double getCost() {
        return beverage.getCost() + 0.35;
    }
}
