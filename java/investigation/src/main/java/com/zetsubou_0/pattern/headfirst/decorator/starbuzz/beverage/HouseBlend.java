package com.zetsubou_0.pattern.headfirst.decorator.starbuzz.beverage;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class HouseBlend extends Beverage {
    public HouseBlend() {
        description = "House Blend Coffee";
    }

    @Override public double getCost() {
        return 0.89;
    }
}
