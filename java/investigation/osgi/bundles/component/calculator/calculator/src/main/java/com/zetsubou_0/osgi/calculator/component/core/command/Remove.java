package com.zetsubou_0.osgi.calculator.component.core.command;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.calculator.component.api.CalculatorThreadStore;
import com.zetsubou_0.osgi.calculator.component.helper.BundleHelper;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleException;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 9/4/2015.
 */
@Component
@Service(value = ShellCommand.class)
@Property(name = ShellCommand.SHELL_COMMAND, value = "remove")
public class Remove implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        CalculatorThreadStore calculatorThread = (CalculatorThreadStore) params.get(ShellCommand.CALCULATOR_THREAD);
        List<String> operations = (List<String>) params.get(ShellCommand.OPERATIONS);
        Set<Bundle> cache = calculatorThread.getTracker().getCache();
        for(String operation : operations) {
            Bundle bundle = BundleHelper.getBundleByHeader(cache, Operation.OPERATION_NAME, operation);
            if(bundle != null) {
                try {
                    bundle.uninstall();
                } catch (BundleException e) {
                    throw new CommandException(e);
                }
            }
        }
    }
}
