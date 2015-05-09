package com.epam.pattern.headfirst.factory.pizza;

import com.epam.pattern.headfirst.factory.pizza.pizza.Pizza;
import com.epam.pattern.headfirst.factory.pizza.store.BelarusPizzaStore;
import com.epam.pattern.headfirst.factory.pizza.store.EnglishPizzaStore;
import com.epam.pattern.headfirst.factory.pizza.store.PizzaStore;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 1/13/2015.
 *
 * The Factory Method Pattern defines an interface
 * for creating an object, but lets subclasses decide which
 * class to instantiate. Factory Method lets a class defer
 * instantiation to subclasses.
 *
 */
public class PizzaStoreRunner {
    public static void main(String[] args) {
        PizzaStore bs = new BelarusPizzaStore();
        PizzaStore es = new EnglishPizzaStore();

        List<Pizza> pizzas = new ArrayList<Pizza>();

        pizzas.add(bs.createPizza(PizzaStore.PizzaType.CHEESE));
        pizzas.add(es.createPizza(PizzaStore.PizzaType.MIX));

        for(Pizza pizza : pizzas) {
            System.out.println(pizza);
        }
    }
}
