package com.zetsubou_0.osgi.calculator.api;

import com.zetsubou_0.osgi.calculator.api.exception.CommandExxeption;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public interface ShellCommand {
    void setOutput(PrintStream out);
    void execute() throws CommandExxeption;
}
