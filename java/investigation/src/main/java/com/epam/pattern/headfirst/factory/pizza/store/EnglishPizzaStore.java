package com.epam.pattern.headfirst.factory.pizza.store;

import com.epam.pattern.headfirst.factory.pizza.ingredient.EnglishIngredientFactory;
import com.epam.pattern.headfirst.factory.pizza.pizza.EnglishMixPizza;
import com.epam.pattern.headfirst.factory.pizza.pizza.Pizza;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class EnglishPizzaStore extends PizzaStore {
    @Override
    public Pizza createPizza(PizzaType type) {
        switch(type) {
            case CHEESE:
                return null;
            case MIX:
                return new EnglishMixPizza(new EnglishIngredientFactory());
        }
        return null;
    }
}
