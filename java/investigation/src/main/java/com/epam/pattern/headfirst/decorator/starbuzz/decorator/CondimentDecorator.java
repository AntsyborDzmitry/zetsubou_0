package com.epam.pattern.headfirst.decorator.starbuzz.decorator;

import com.epam.pattern.headfirst.decorator.starbuzz.beverage.Beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public abstract class CondimentDecorator extends Beverage {
    protected Beverage beverage;

    public CondimentDecorator(Beverage beverage) {
        this.beverage = beverage;
    }

    public abstract String getDescription();
}
