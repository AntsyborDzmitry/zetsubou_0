package com.zetsubou_0.pattern.headfirst.adapter.duckadapter.fly;

/**
 * Created by Kiryl_Lutsyk on 1/9/2015.
 */
public class WingsFly implements Flyable {
    @Override public void fly() {
        System.out.println("i am fly with my wings");
    }
}
