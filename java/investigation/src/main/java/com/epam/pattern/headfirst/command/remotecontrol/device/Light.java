package com.epam.pattern.headfirst.command.remotecontrol.device;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class Light implements Device {
    public Light() {
    }

    public void on() {
        System.out.println("Light on");
    }

    public void off() {
        System.out.println("Light off");
    }
}
