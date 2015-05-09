package com.zetsubou_0.pattern.headfirst.adapter.duckadapter.bean;

import com.zetsubou_0.pattern.headfirst.strategy.simuduck.fly.Flyable;

/**
 * Created by Kiryl_Lutsyk on 1/19/2015.
 */
public class Turkey {
    protected Flyable flyBehaviour;

    public Turkey(Flyable flyBehaviour) {
        this.flyBehaviour = flyBehaviour;
    }

    public void move() {
        System.out.println("Move ... but very slowly");
    }

    public void performedFly() {
        flyBehaviour.fly();
    }

    public void setFlyBehaviour(Flyable flyBehaviour) {
        this.flyBehaviour = flyBehaviour;
    }

    @Override
    public String toString() {
        return "I am turkey";
    }
}
