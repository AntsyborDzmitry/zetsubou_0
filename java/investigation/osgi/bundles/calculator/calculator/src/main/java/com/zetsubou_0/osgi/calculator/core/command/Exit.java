package com.zetsubou_0.osgi.calculator.core.command;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class Exit implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        synchronized (CalculatorThread.class) {
            CalculatorThread calculatorThread = (CalculatorThread) params.get(ShellCommand.CALCULATOR_THREAD);
            System.out.println("Calculator closing...");
            calculatorThread.getBundleTracker().stopTracking();
            CalculatorThread.class.notifyAll();
        }
    }
}
