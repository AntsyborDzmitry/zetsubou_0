package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.Operation;
import org.osgi.framework.Bundle;

import java.util.ArrayList;
import java.util.Dictionary;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Calculator {
    private static final String REG_EXP = "(([0-9\\s.()]+)([%s]{1})($1))*";
    private Set<Bundle> cache;

    private Calculator() {}

    public Calculator(Set<Bundle> cache) {
        this.cache = cache;
    }

    public Double calculate(String input) throws IllegalArgumentException{
        if(!validate(input)) {
            throw new IllegalArgumentException("Wrong input string or unknown command present in string.\n" + input);
        }
        Double result = 10.3;
        List<Bundle> bundles = new ArrayList<>(cache);


        return result;
    }

    private boolean validate(String str) {
        Pattern p = Pattern.compile(compileOperationRegExp());
        Matcher matcher = p.matcher(str);
        return matcher.find();
    }

    private String compileOperationRegExp() {
        StringBuilder sb = new StringBuilder();
        for(Bundle bundle : cache) {
            Dictionary<String, String> headers = bundle.getHeaders();
            String operation = headers.get(Operation.OPERATION_NAME);
            sb.append(operation);
        }
        if(sb.length() == 0) {
            throw new IllegalArgumentException("Operations weren't present in system");
        }
        return String.format(REG_EXP, sb.toString());
    }
}
