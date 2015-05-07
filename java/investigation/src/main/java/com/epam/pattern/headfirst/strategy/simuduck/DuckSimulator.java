package com.epam.pattern.headfirst.strategy.simuduck;

import com.epam.pattern.headfirst.strategy.simuduck.duck.DefaultDuck;
import com.epam.pattern.headfirst.strategy.simuduck.duck.Duck;
import com.epam.pattern.headfirst.strategy.simuduck.duck.DuckModel;
import com.epam.pattern.headfirst.strategy.simuduck.duck.WoodDuck;
import com.epam.pattern.headfirst.strategy.simuduck.fly.WingsFly;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 *
 * The Strategy Pattern defines a family of algorithms,
 * encapsulates each one, and makes them interchangeable.
 * Strategy lets the algorithm vary independently from
 * clients that use it.
 *
 */
public class DuckSimulator {
    public static void main(String[] args) {
        List<Duck> ducks = new ArrayList<Duck>();

        Duck model = new DuckModel();

        ducks.add(new DefaultDuck());
        ducks.add(new WoodDuck());
        ducks.add(model);

        model.setFlyBehaviour(new WingsFly());

        for(Duck duck : ducks) {
            System.out.println("<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>");
            duck.print();
            duck.performedQuack();
            duck.move();
            duck.performedFly();
            System.out.println("------------------------------");
        }
    }
}
