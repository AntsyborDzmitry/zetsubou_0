package com.zetsubou_0.osgi.calculator.test;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Runner {
    private static final String REG_EXP = "(\\s*[0-9.]\\s*)+";

    public static void main(String[] args) {
        String[] operations = {"+", "-"};
        String input = "10 + 3 - 7 - 4 + 100";
        List<String> op = Arrays.asList(operations);
        try {
            System.out.println(execute(input, 0, null));
        } catch (OperationException e) {
            e.printStackTrace();
        }
    }

    private static double execute(String str, double initValue, String lastOperation) throws OperationException {
        String[] operationsArray = str.split(REG_EXP);
        List<String> operations = Arrays.asList(operationsArray);
        Collections.reverse(operations);
        for(String operation : operations) {
            if(StringUtils.isBlank(operation)) {
                continue;
            }
            String val = str.substring(str.lastIndexOf(operation) + 1, str.length());
            StringBuilder commandWithDigit = new StringBuilder();
            commandWithDigit.append("[");
            commandWithDigit.append(operation);
            commandWithDigit.append("]");
            commandWithDigit.append(val.replace(".", "[.]"));
            commandWithDigit.append("$");
            return executeCommand(lastOperation, initValue, execute(str.replaceAll(commandWithDigit.toString(), StringUtils.EMPTY), Double.parseDouble(val.trim()), operation));
        }
        if(operations.size() == 0) {
            try{
                return executeCommand(lastOperation, initValue, Double.parseDouble(str.trim()));
            } catch (Exception e) {}
        }
        return initValue;
    }

    private static double executeCommand(String command, double right, double left) throws OperationException {
        Operation operation = null;
        if("+".equals(command)) {
            operation = new Add();
        } else if("-".equals(command)) {
            operation = new Minus();
        }
        if(operation == null) {
            return right;
        }
        return operation.execute(left, right);
    }
}
