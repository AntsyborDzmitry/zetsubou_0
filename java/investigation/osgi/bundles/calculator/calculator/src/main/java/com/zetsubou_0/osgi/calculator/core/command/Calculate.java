package com.zetsubou_0.osgi.calculator.core.command;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class Calculate implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        CalculatorThread calculatorThread = (CalculatorThread) params.get(ShellCommand.CALCULATOR_THREAD);
        String input = (String) params.get(ShellCommand.INPUT_STRING);
        try {
            params.put(ShellCommand.RESULT, calculatorThread.calculate(input));
        } catch (OperationException e) {
            throw new CommandException(e);
        }
    }
}
