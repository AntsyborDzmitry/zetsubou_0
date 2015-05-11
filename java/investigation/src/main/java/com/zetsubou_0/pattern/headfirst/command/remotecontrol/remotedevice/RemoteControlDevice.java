package com.zetsubou_0.pattern.headfirst.command.remotecontrol.remotedevice;

import com.zetsubou_0.pattern.headfirst.command.remotecontrol.command.Command;
import com.zetsubou_0.pattern.headfirst.command.remotecontrol.command.EmptyCommand;

/**
 * Created by Kiryl_Lutsyk on 1/14/2015.
 */
public class RemoteControlDevice {
    private static final int BUTTON_NUMBER = 8;
    private Command[] commandsOn;
    private Command[] commandsOff;
    private Command last;

    public RemoteControlDevice() {
        commandsOn = new Command[BUTTON_NUMBER];
        commandsOff = new Command[BUTTON_NUMBER];

        for(int i = 0; i < BUTTON_NUMBER; i ++) {
            commandsOn[i] = new EmptyCommand();
            commandsOff[i] = new EmptyCommand();
        }

        last = commandsOn[0];
    }

    public void setCommand(int slot, Command commandOn, Command commandOff) {
        commandsOn[slot] = commandOn;
        commandsOff[slot] = commandOff;
    }

    public void buttonOnWasPressed(int slot) {
        last = commandsOn[slot];
        commandsOn[slot].execude();
    }

    public void buttonOffWasPressed(int slot) {
        last = commandsOff[slot];
        commandsOff[slot].execude();
    }

    public void buttonUndoWasPressed() {
        last.undo();
    }
}
