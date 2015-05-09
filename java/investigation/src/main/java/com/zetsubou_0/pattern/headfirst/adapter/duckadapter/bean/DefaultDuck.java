package com.zetsubou_0.pattern.headfirst.adapter.duckadapter.bean;


import com.zetsubou_0.pattern.headfirst.strategy.simuduck.fly.WingsFly;
import com.zetsubou_0.pattern.headfirst.strategy.simuduck.quack.Quack;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class DefaultDuck extends Duck {
    public DefaultDuck() {
        quackBehaviour = new Quack();
        flyBehaviour = new WingsFly();
    }

    @Override public void print() {
        System.out.println("I am default duck.");
    }
}
