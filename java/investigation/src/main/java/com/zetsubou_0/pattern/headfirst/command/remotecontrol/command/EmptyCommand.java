package com.zetsubou_0.pattern.headfirst.command.remotecontrol.command;

/**
 * Created by Kiryl_Lutsyk on 1/15/2015.
 */
public class EmptyCommand implements Command {
    public EmptyCommand() {
    }

    @Override public void execude() {

    }

    @Override public void undo() {

    }
}
