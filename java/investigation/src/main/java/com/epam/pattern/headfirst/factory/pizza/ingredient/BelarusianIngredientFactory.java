package com.epam.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class BelarusianIngredientFactory implements PizzaIngredientFactory {
    @Override public Sauce getSauce() {
        return new BelarusianSauce();
    }

    @Override public Cheese getCheese() {
        return new BelarusianCheese();
    }

    @Override public Dough getDough() {
        return new BelarusianDough();
    }
}
