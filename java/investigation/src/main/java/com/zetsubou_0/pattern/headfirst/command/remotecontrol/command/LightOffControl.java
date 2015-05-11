package com.zetsubou_0.pattern.headfirst.command.remotecontrol.command;

import com.zetsubou_0.pattern.headfirst.command.remotecontrol.device.Light;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class LightOffControl implements Command {
    private Light light;

    public LightOffControl(Light light) {
        this.light = light;
    }

    @Override public void execude() {
        light.off();
    }

    @Override public void undo() {
        System.out.println("undo");
        light.on();
    }
}
