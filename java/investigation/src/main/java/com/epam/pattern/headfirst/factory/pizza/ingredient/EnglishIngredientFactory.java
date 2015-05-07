package com.epam.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class EnglishIngredientFactory implements PizzaIngredientFactory {
    @Override public Sauce getSauce() {
        return new EnglishSauce();
    }

    @Override public Cheese getCheese() {
        return new EnglishCheese();
    }

    @Override public Dough getDough() {
        return new EnglishDough();
    }
}
