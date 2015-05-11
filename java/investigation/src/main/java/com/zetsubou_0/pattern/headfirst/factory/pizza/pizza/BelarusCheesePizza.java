package com.zetsubou_0.pattern.headfirst.factory.pizza.pizza;

import com.zetsubou_0.pattern.headfirst.factory.pizza.ingredient.PizzaIngredientFactory;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class BelarusCheesePizza extends Pizza {
    public BelarusCheesePizza(
            PizzaIngredientFactory ingredientFactory) {
        super(ingredientFactory);
    }

    @Override
    protected void prepare() {
        dough = ingredientFactory.getDough();
        cheese = ingredientFactory.getCheese();
    }
}
