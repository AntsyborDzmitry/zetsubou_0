package com.zetsubou_0.pattern.headfirst.factory.pizza.store;

import com.zetsubou_0.pattern.headfirst.factory.pizza.pizza.Pizza;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 */
public abstract class PizzaStore {
    public enum PizzaType {CHEESE, MIX};

    public abstract Pizza createPizza(PizzaType type);
}
