package com.zetsubou_0.pattern.headfirst.strategy.simuduck.duck;

import com.zetsubou_0.pattern.headfirst.strategy.simuduck.fly.Flyable;
import com.zetsubou_0.pattern.headfirst.strategy.simuduck.quack.Quackable;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public abstract class Duck {
    protected Flyable flyBehaviour;
    protected Quackable quackBehaviour;

    public Duck() {
    }

    public abstract void print();

    public void move() {
        System.out.println("I am moving.");
    }

    public void performedFly() {
        flyBehaviour.fly();
    }

    public void performedQuack() {
        quackBehaviour.quack();
    }

    public void setFlyBehaviour(Flyable flyBehaviour) {
        this.flyBehaviour = flyBehaviour;
    }

    public void setQuackBehaviour(Quackable quackBehaviour) {
        this.quackBehaviour = quackBehaviour;
    }
}
