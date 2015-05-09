package com.epam.pattern.headfirst.factory.pizza.pizza;

import com.epam.pattern.headfirst.factory.pizza.ingredient.Cheese;
import com.epam.pattern.headfirst.factory.pizza.ingredient.Dough;
import com.epam.pattern.headfirst.factory.pizza.ingredient.PizzaIngredientFactory;
import com.epam.pattern.headfirst.factory.pizza.ingredient.Sauce;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public abstract class Pizza {
    protected PizzaIngredientFactory ingredientFactory;
    protected Sauce sauce;
    protected Dough dough;
    protected Cheese cheese;

    public Pizza(PizzaIngredientFactory ingredientFactory) {
        this.ingredientFactory = ingredientFactory;
    }

    protected abstract void prepare();
}
