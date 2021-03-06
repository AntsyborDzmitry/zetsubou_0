package com.zetsubou_0.osgi.calculator.component.core.command;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
@Component
@Service(value = ShellCommand.class)
@Property(name = ShellCommand.SHELL_COMMAND, value = "calculate")
public class Calculate implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        Store calculatorThread = (Store) params.get(ShellCommand.CALCULATOR_THREAD);
        String input = (String) params.get(ShellCommand.INPUT_STRING);
        try {
            params.put(ShellCommand.RESULT, calculatorThread.calculate(input));
        } catch (OperationException e) {
            throw new CommandException(e);
        }
    }
}
