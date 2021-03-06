package com.zetsubou_0.osgi.calculator.component.core.command;

import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.calculator.component.api.Store;
import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Property;
import org.apache.felix.scr.annotations.Service;
import org.osgi.framework.Bundle;
import org.osgi.framework.BundleContext;
import org.osgi.framework.BundleException;

import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
@Component
@Service(value = ShellCommand.class)
@Property(name = ShellCommand.SHELL_COMMAND, value = "add")
public class Add implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        Store calculatorThread = (Store) params.get(ShellCommand.CALCULATOR_THREAD);
        String path = (String) params.get(ShellCommand.PATH);
        String protocol = (String) params.get(ShellCommand.PROTOCOL);
        BundleContext bundleContext = calculatorThread.getBundleContext();
        Bundle bundle = null;
        try {
            bundle = bundleContext.installBundle(protocol + path);
            bundle.start();
        } catch (BundleException e) {
            throw new CommandException(e);
        }
    }
}
