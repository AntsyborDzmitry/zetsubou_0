package com.epam.pattern.headfirst.strategy.simuduck.duck;

import com.epam.pattern.headfirst.strategy.simuduck.fly.NoFly;
import com.epam.pattern.headfirst.strategy.simuduck.quack.KeepSilence;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class DuckModel extends Duck {
    public DuckModel() {
        quackBehaviour = new KeepSilence();
        flyBehaviour = new NoFly();
    }

    @Override public void print() {
        System.out.println("I am a simple duck model.");
    }
}
