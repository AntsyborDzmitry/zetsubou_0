package com.zetsubou_0.osgi.calculator.core.command;

import com.zetsubou_0.osgi.calculator.api.ShellCommand;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public abstract class AbstractCommand implements ShellCommand {
    protected PrintStream out;

    private AbstractCommand() {}

    public AbstractCommand(PrintStream out) {
        setOutput(out);
    }

    @Override
    public void setOutput(PrintStream out) {
        this.out = out;
    }
}
