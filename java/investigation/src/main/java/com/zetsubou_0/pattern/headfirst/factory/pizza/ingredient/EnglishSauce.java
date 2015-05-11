package com.zetsubou_0.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class EnglishSauce implements Sauce {
    @Override public Sauce getSauce() {
        return this;
    }
}
