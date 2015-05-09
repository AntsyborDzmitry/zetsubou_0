package com.zetsubou_0.pattern.headfirst.facade.combinedevice.device;

/**
 * Created by Kiryl_Lutsyk on 1/19/2015.
 */
public class Light {
    private String color;

    public Light(String color) {
        this.color = color;
    }

    public void on() {
        System.out.println("Light " + color + " on");
    }

    public void off() {
        System.out.println("Light off");
    }
}
