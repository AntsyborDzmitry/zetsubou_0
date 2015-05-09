package com.epam.pattern.headfirst.command.remotecontrol.command;

import com.epam.pattern.headfirst.command.remotecontrol.device.Light;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class LightOnControl implements Command {
    private Light light;

    public LightOnControl(Light light) {
        this.light = light;
    }

    @Override
    public void execude() {
        light.on();
    }

    @Override
    public void undo() {
        System.out.println("undo");
        light.off();
    }
}
