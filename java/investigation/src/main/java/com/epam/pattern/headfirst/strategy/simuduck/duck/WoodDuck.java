package com.epam.pattern.headfirst.strategy.simuduck.duck;

import com.epam.pattern.headfirst.strategy.simuduck.fly.NoFly;
import com.epam.pattern.headfirst.strategy.simuduck.quack.KeepSilence;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class WoodDuck extends Duck {
    public WoodDuck() {
        quackBehaviour = new KeepSilence();
        flyBehaviour = new NoFly();
    }

    @Override public void print() {
        System.out.println("I am wood duck.");
    }
}
