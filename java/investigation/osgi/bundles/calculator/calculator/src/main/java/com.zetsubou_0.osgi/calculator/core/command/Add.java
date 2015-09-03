package com.zetsubou_0.osgi.calculator.core.command;

import com.zetsubou_0.osgi.api.exception.CommandExxeption;

import java.io.PrintStream;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class Add extends AbstractCommand {
    public Add(PrintStream out) {
        super(out);
    }

    @Override
    public void execute() throws CommandExxeption {
        out.println("Add");
    }
}
