package com.epam.pattern.headfirst.adapter.duckadapter.fly;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class NoFly implements Flyable {
    @Override public void fly() {
        System.out.println("I can't fly");
    }
}
