package com.epam.pattern.headfirst.adapter.duckadapter.adpter;

import com.epam.pattern.headfirst.adapter.duckadapter.bean.Duck;
import com.epam.pattern.headfirst.adapter.duckadapter.bean.Turkey;
import com.epam.pattern.headfirst.strategy.simuduck.fly.Flyable;
import com.epam.pattern.headfirst.strategy.simuduck.quack.Quackable;

/**
 * Created by Kiryl_Lutsyk on 1/19/2015.
 */
public class DuckAdapter extends Duck {
    private Turkey turkey;

    public DuckAdapter(Turkey turkey) {
        this.turkey = turkey;
    }

    @Override
    public void move() {
        turkey.move();
    }

    @Override
    public void performedFly() {
        turkey.performedFly();
    }

    @Override
    public void performedQuack() {
        System.out.println("I can't quack");
    }

    @Override
    public void setFlyBehaviour(Flyable flyBehaviour) {
        turkey.setFlyBehaviour(flyBehaviour);
    }

    @Override
    public void setQuackBehaviour(Quackable quackBehaviour) {
    }

    @Override
    public void print() {
        System.out.println("I'm like a turkey like a duck");
    }

    @Override
    public String toString() {
        return turkey.toString();
    }
}
