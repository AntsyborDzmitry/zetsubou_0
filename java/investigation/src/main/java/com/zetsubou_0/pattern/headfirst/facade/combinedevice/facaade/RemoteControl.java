package com.zetsubou_0.pattern.headfirst.facade.combinedevice.facaade;

import com.zetsubou_0.pattern.headfirst.facade.combinedevice.device.Light;
import com.zetsubou_0.pattern.headfirst.facade.combinedevice.device.Window;

import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 1/19/2015.
 */
public class RemoteControl {
    private Light regularLight;
    private Window window;
    private List<Light> disco;

    public RemoteControl(Light regularLight, Window window, List<Light> disco) {
        this.regularLight = regularLight;
        this.window = window;
        this.disco = disco;
    }

    public void backHome() {
        regularLight.on();
        window.open();
    }

    public void goAtWork() {
        window.close();
        regularLight.off();
    }

    public void discoMode() {
        for(Light light : disco) {
            light.on();
        }
        window.open();
    }

    public void stopAll() {
        for(Light light : disco) {
            light.off();
        }
        regularLight.off();
        window.close();
    }
}
