package com.zetsubou_0.osgi.calculator.core.command;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.ShellCommand;
import com.zetsubou_0.osgi.api.exception.CommandException;
import com.zetsubou_0.osgi.calculator.core.CalculatorThread;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;

import java.util.List;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 9/8/2015.
 */
public class UpdateOperationList implements ShellCommand {
    @Override
    public void execute(Map<String, Object> params) throws CommandException {
        CalculatorThread calculatorThread = (CalculatorThread) params.get(ShellCommand.CALCULATOR_THREAD);
        List<String> operations = BundleHelper.getHeader(calculatorThread.getBundleTracker().getCache(), Operation.OPERATION_NAME);
        params.put(ShellCommand.OPERATIONS, operations);
    }
}
