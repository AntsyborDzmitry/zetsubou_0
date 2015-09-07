package com.zetsubou_0.osgi.calculator.core;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.bean.OperationBean;
import com.zetsubou_0.osgi.calculator.bean.OperationGroupBean;
import com.zetsubou_0.osgi.calculator.helper.BundleHelper;
import org.osgi.framework.Bundle;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Calculator {
    private static final String PARENTHESIS_PATTERN = "([(\\s%s0-9.]|#group([0-9.]+)#)+[)]";
    private static final String PARENTHESIS_PATTERN_2 = "[(]([\\s%s0-9.]|#group([0-9.]+)#)+[)]";
    private static final String PARENTHESIS_PATTERN_3 = "^[(](.*)[)]$";
    private static final String GROUP_PATTERN = "([0-9.]+|#group([0-9.]+)#)[\\s]*([\\%s])[\\s]*([0-9.]+|#group([0-9.]+)#)";
    private static final String REGEX_GROUP = "^[\\s(]#group[0-9]+#[\\s)]$";
    private static final String OPERATION = "#group%s#";

    private Set<OperationBean> presentedOperations;
    private Map<Integer, OperationGroupBean> groups = new HashMap<>();
    private int operationNumber = 0;
    private OperationGroupBean last = new OperationGroupBean();
    private Set<Bundle> cache;

    private Calculator() {}

    public Calculator(Set<Bundle> cache) {
        this.cache = cache;
    }

    public double calculate(String input) throws OperationException {
        if(!validate(input)) {
            throw new OperationException("Not valid input string");
        }
        initPresentedOperation();
        parseInput(removeFirstParenthesis(input));
        return last.getValue();
    }

    private void parseInput(String input) throws OperationException {
        if(input == null || "".equals(input)) {
            return;
        }
        Pattern pattern = Pattern.compile(String.format(PARENTHESIS_PATTERN, compileOperationRegExp()));
        Matcher matcher = pattern.matcher(input);
        if(matcher.find()) {
            String foundString = matcher.group();
            if(foundString != null || !"".equals(foundString)) {
                pattern = Pattern.compile(String.format(PARENTHESIS_PATTERN_2, compileOperationRegExp()));
                matcher = pattern.matcher(foundString);
                if(matcher.find()) {
                    String groupString = matcher.group();
                    if(groupString != null && !"".equals(groupString)) {
                        input = input.replace(groupString, String.format(OPERATION, operationNumber));
                        parseGroup(groupString, input);
                        parseInput(input);
                    }
                }
            }
        } else {
            last = parsePriorityGroup(input);
        }
    }

    private OperationGroupBean parseGroup(String group, String input) throws OperationException {
        OperationGroupBean operationGroup = new OperationGroupBean();
        int operationNum = operationNumber;
        groups.put(operationNumber++, operationGroup);
        operationGroup = parsePriorityGroup(group);
        groups.put(operationNum, operationGroup);

        return operationGroup;
    }

    private OperationGroupBean parsePriorityGroup(String group) throws OperationException {
        OperationGroupBean operationGroup = new OperationGroupBean();

        try {
            for(OperationBean operationBean : presentedOperations) {
                Pattern pattern = Pattern.compile(String.format(GROUP_PATTERN, operationBean.getOperation()));
                Matcher matcher = pattern.matcher(group);
                while(matcher.find()) {
                    operationGroup = new OperationGroupBean();
                    String left = matcher.group(1);
                    String right = matcher.group(4);
                    if(matcher.group(2) == null) {
                        operationGroup.setLeft(Double.parseDouble(left));
                    } else {
                        operationGroup.setLeftComplicated(true);
                        operationGroup.setLeftGroup(groups.get(Integer.parseInt(matcher.group(2))));
                    }
                    if(matcher.group(5) == null) {
                        operationGroup.setRight(Double.parseDouble(right));
                    } else {
                        operationGroup.setRightComplicated(true);
                        operationGroup.setRightGroup(groups.get(Integer.parseInt(matcher.group(5))));
                    }
                    Operation op = (Operation) Class.forName(operationBean.getClassName()).newInstance();
                    operationGroup.setOperation(op);
                    groups.put(operationNumber, operationGroup);
                    if(!group.matches(REGEX_GROUP)) {
                        group = group.replace(matcher.group(), String.format(OPERATION, operationNumber++));
                    }
                }
            }
        } catch(Exception e) {
            throw new OperationException(e);
        }

        return operationGroup;
    }

    private void createSet() {
        presentedOperations = new TreeSet(new Comparator<OperationBean>() {
            @Override
            public int compare(OperationBean o1, OperationBean o2) {
                int rank1 = o1.getRank();
                int rank2 = o2.getRank();
                if(rank1 == rank2) {
                    return o2.getOperation().hashCode() - o1.getOperation().hashCode();
                }
                return rank2 - rank1;
            }
        });
    }

    private String removeFirstParenthesis(String input) {
        if(input.matches(PARENTHESIS_PATTERN_3)) {
            Pattern pattern = Pattern.compile(PARENTHESIS_PATTERN_3);
            Matcher matcher = pattern.matcher(input);
            if(matcher.find()) {
                return matcher.group(1);
            }
        }
        return input;
    }

    private boolean validate(String str) throws OperationException {
        Pattern p = Pattern.compile(compileOperationRegExp());
        Matcher matcher = p.matcher(str);
        return matcher.find();
    }

    private String compileOperationRegExp() throws OperationException {
        StringBuilder sb = new StringBuilder();
        List<String> operations = BundleHelper.getHeader(cache, Operation.OPERATION_NAME);
        for(String operation : operations) {
            sb.append(operation);
        }
        if(sb.length() == 0) {
            throw new OperationException("Operations weren't present in system");
        }
        return Pattern.quote(sb.toString());
    }

    private void initPresentedOperation() {
        createSet();
        for(Bundle operationBundle : cache) {
            OperationBean operationBean = new OperationBean();
            operationBean.setClassName(BundleHelper.getHeader(operationBundle, Operation.OPERATION_BASE_CLASS));
            operationBean.setOperation(BundleHelper.getHeader(operationBundle, Operation.OPERATION_NAME));
            operationBean.setRank(Integer.parseInt(BundleHelper.getHeader(operationBundle, Operation.OPERATION_RANK)));
            presentedOperations.add(operationBean);
        }
    }
}
