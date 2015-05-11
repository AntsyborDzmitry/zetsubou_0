package com.zetsubou_0.pattern.headfirst.factory.pizza.store;

import com.zetsubou_0.pattern.headfirst.factory.pizza.ingredient.BelarusianIngredientFactory;
import com.zetsubou_0.pattern.headfirst.factory.pizza.pizza.BelarusCheesePizza;
import com.zetsubou_0.pattern.headfirst.factory.pizza.pizza.Pizza;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public class BelarusPizzaStore extends PizzaStore {
    @Override
    public Pizza createPizza(PizzaType type) {
        switch(type) {
            case CHEESE:
                return new BelarusCheesePizza(new BelarusianIngredientFactory());
            case MIX:
                return null;
        }
        return null;
    }
}
