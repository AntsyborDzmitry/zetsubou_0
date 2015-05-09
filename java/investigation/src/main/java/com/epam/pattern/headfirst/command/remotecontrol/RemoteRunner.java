package com.epam.pattern.headfirst.command.remotecontrol;

import com.epam.pattern.headfirst.command.remotecontrol.command.LightOffControl;
import com.epam.pattern.headfirst.command.remotecontrol.command.LightOnControl;
import com.epam.pattern.headfirst.command.remotecontrol.device.Light;
import com.epam.pattern.headfirst.command.remotecontrol.remotedevice.RemoteControlDevice;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 *
 * The Command Pattern encapsulates a request as an
 * object, thereby letting you parameterize other objects
 * with different requests, queue or log requests, and support
 * undoable operations.
 *
 */
public class RemoteRunner {
    public static void main(String[] args) {
        RemoteControlDevice remoteControlDevice = new RemoteControlDevice();
        remoteControlDevice.setCommand(3, new LightOnControl(new Light()), new LightOffControl(new Light()));

        remoteControlDevice.buttonOnWasPressed(1);
        remoteControlDevice.buttonUndoWasPressed();

        remoteControlDevice.buttonOffWasPressed(3);
        remoteControlDevice.buttonUndoWasPressed();

        remoteControlDevice.buttonOnWasPressed(3);
        remoteControlDevice.buttonUndoWasPressed();
    }
}
