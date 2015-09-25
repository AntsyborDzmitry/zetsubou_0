package com.zetsubou_0.osgi.calculator.component.core.command;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import com.zetsubou_0.osgi.calculator.component.helper.BundleHelper;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;

import java.util.List;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
@Component
@Service(value = ShellCommand.class)
@Property(name = ShellCommand.SHELL_COMMAND, value = "update")
public class UpdateOperationList implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        Store calculatorThread = (Store) params.get(ShellCommand.CALCULATOR_THREAD);
        List<String> operations = BundleHelper.getHeader(calculatorThread.getTracker().getCache(), Operation.OPERATION_NAME);
        params.put(ShellCommand.OPERATIONS, operations);
    }
}
