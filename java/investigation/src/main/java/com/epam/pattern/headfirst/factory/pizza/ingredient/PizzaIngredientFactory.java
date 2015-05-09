package com.epam.pattern.headfirst.factory.pizza.ingredient;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public interface PizzaIngredientFactory {
    Sauce getSauce();
    Cheese getCheese();
    Dough getDough();
}
