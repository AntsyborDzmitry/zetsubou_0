package com.epam.pattern.headfirst.strategy.simuduck.quack;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class Quack implements Quackable {
    @Override public void quack() {
        System.out.println("Quack quack");
    }
}
