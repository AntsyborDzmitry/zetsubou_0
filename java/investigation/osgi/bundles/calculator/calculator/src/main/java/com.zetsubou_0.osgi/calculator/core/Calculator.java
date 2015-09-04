package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import com.zetsubou_0.osgi.calculator.test.Add;
import com.zetsubou_0.osgi.calculator.test.Minus;
import org.osgi.framework.Bundle;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Calculator {
    private static final String REG_EXP = "(\\s*[0-9.]\\s*)+";
    private List<String> validOperations;
    private Set<Bundle> cache;

    private Calculator() {}

    public Calculator(Set<Bundle> cache) {
        this.cache = cache;
    }

    public double calculate(String input) throws OperationException {
        updateValidOperations();
        return execute(input, 0, null);
    }

    private void updateValidOperations() {
        validOperations = BundleHelper.getHeader(cache, Operation.OPERATION_NAME);
    }

    private double execute(String str, double initValue, String lastOperation) throws OperationException {
        String[] operationsArray = str.split(REG_EXP);
        List<String> operations = Arrays.asList(operationsArray);
        Collections.reverse(operations);
        for(String operation : operations) {
            if("".equals(operation)) {
                continue;
            }
            if(!validOperations.contains(operation)) {
                throw new OperationException("Operation not found. \"" + operation + "\"");
            }
            String val = str.substring(str.lastIndexOf(operation) + 1, str.length());
            StringBuilder commandWithDigit = new StringBuilder();
            commandWithDigit.append("[");
            commandWithDigit.append(operation);
            commandWithDigit.append("]");
            commandWithDigit.append(val.replace(".", "[.]"));
            commandWithDigit.append("$");
            return executeCommand(lastOperation, initValue, execute(str.replaceAll(commandWithDigit.toString(), ""), Double.parseDouble(val.trim()), operation));
        }
        if(operations.size() == 0) {
            try{
                return executeCommand(lastOperation, initValue, Double.parseDouble(str.trim()));
            } catch (Exception e) {}
        }
        return initValue;
    }

    private double executeCommand(String command, double right, double left) throws OperationException {
        Operation operation = null;
        Bundle operationBundle = BundleHelper.getBundleByHeader(cache, Operation.OPERATION_NAME, command);
        if(operationBundle != null) {
            try {
                Class operationClass = operationBundle.loadClass(BundleHelper.getHeader(operationBundle, Operation.OPERATION_CLASS));
                operation = (Operation) operationClass.newInstance();
            } catch (ClassNotFoundException e) {
                throw new OperationException(e);
            } catch (InstantiationException e) {
                throw new OperationException(e);
            } catch (IllegalAccessException e) {
                throw new OperationException(e);
            }
        }
        if(operation == null) {
            return left;
        }
        return operation.execute(left, right);
    }

    private boolean validate(String str) throws OperationException {
        Pattern p = Pattern.compile(compileOperationRegExp());
        Matcher matcher = p.matcher(str);
        return matcher.find();
    }

    private String compileOperationRegExp() throws OperationException {
        StringBuilder sb = new StringBuilder();
        for(Bundle bundle : cache) {
            sb.append(BundleHelper.getHeader(bundle, Operation.OPERATION_NAME));
        }
        if(sb.length() == 0) {
            throw new OperationException("Operations weren't present in system");
        }
        return String.format(REG_EXP, sb.toString());
    }
}
