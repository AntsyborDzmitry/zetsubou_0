package com.zetsubou_0.pattern.headfirst.facade.combinedevice;

import com.zetsubou_0.pattern.headfirst.facade.combinedevice.device.Light;
import com.zetsubou_0.pattern.headfirst.facade.combinedevice.device.Window;
import com.zetsubou_0.pattern.headfirst.facade.combinedevice.facaade.RemoteControl;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 1/19/2015.
 *
 * The Facade Pattern provides a unified interface to a
 * set of interfaces in a subsytem. Facade defines a higher-
 * level interface that makes the subsystem easier to use.
 *
 */
public class FacadeRunner {
    public static void main(String[] args) {
        Light regularLight = new Light("transient");
        Window window = new Window();
        List<Light> disco = new ArrayList<Light>();
        disco.add(new Light("red"));
        disco.add(new Light("green"));
        disco.add(new Light("yellow"));
        disco.add(new Light("blue"));
        disco.add(new Light("pink"));

        RemoteControl remote = new RemoteControl(regularLight, window, disco);

        remote.goAtWork();
        System.out.println();
        remote.backHome();
        System.out.println();
        remote.discoMode();
        System.out.println();
        remote.stopAll();
        System.out.println();
    }
}
