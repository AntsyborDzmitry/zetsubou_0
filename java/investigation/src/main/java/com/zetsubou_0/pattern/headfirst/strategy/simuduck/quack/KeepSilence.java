package com.zetsubou_0.pattern.headfirst.strategy.simuduck.quack;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class KeepSilence implements Quackable {
    @Override public void quack() {
        System.out.println("I can't quack ...");
    }
}