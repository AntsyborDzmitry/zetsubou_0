package com.zetsubou_0.osgi.calculator.test;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Runner {
    private static final String REG_EXP = "(\\s*[0-9.]\\s*)+";

    public static void main(String[] args) {
        String[] operations = {"+", "-"};
        String input = "10 + 3 + 10.2 - 1 + 10";
        List<String> op = Arrays.asList(operations);
        try {
            System.out.println(execute(input, 0));
        } catch (OperationException e) {
            e.printStackTrace();
        }
    }

    private static double execute(String str, double initValue) throws OperationException {
        String[] operations = str.split(REG_EXP);
        for(String operation : operations) {
            if(StringUtils.isBlank(operation)) {
                continue;
            }
            String val = str.substring(0, str.indexOf(operation));
            return executeCommand(operation, initValue, execute(str.replace(val + operation, StringUtils.EMPTY), Double.parseDouble(val.trim())));
        }
//        if(operations.length == 0) {
//            try{
//                executeCommand(operation, initValue, execute(str.replace(val + operation, StringUtils.EMPTY), Double.parseDouble(val.trim())));
//                initValue += Double.parseDouble(str.trim());
//            } catch (Exception e) {}
//        }
        return initValue;
    }

    private static double executeCommand(String command, double right, double left) throws OperationException {
        Operation operation = null;
        if("+".equals(command)) {
            operation = new Add();
        } else if("-".equals(command)) {
            operation = new Minus();
        }
        return operation.execute(left, right);
    }
}
