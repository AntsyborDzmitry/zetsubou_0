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
    private static final String PARENTHESIS_PATTERN = "([(\\s0-9.]|%s|#group([0-9.]+)#)+[)]";
    private static final String PARENTHESIS_PATTERN_2 = "[(]([\\s0-9.]|%s|#group([0-9.]+)#)+[)]";
    private static final String GROUP_PATTERN = "([0-9.]+|#group([0-9.]+)#)[\\s]*(%s)[\\s]*([0-9.]+|#group([0-9.]+)#)";
    private static final String REGEX_GROUP = "^[\\s(]#group[0-9]+#[\\s)]$";
    private static final String REGEX_VALIDATION = "^([\\s()0-9.]|%s)+$";
    private static final String REGEX_WITHOUT_OPERATION = "[0-9.]+[\\s]+[0-9.]+";
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
        input = input.trim();
        initPresentedOperation();
        validateOperations(input);
        if(!validate(input)) {
            throw new OperationException("Not valid input string");
        }
        parseInput(input);
        return last.getValue();
    }

    private void parseInput(String input) throws OperationException {
        if(input == null || "".equals(input)) {
            return;
        }
        Pattern pattern = Pattern.compile(String.format(PARENTHESIS_PATTERN, compileOperationRegExp()));
        Matcher matcher = pattern.matcher(input);
        if(input.matches(REGEX_GROUP)) {
            last = groups.get(Integer.parseInt(input.replaceAll("[\\D]+", "")));
            return;
        }
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
                String operationName = (operationBean.getOperation().length() > 1) ? operationBean.getOperation() : ("[" + Pattern.quote(operationBean.getOperation()) + "]");
                Pattern pattern = Pattern.compile(String.format(GROUP_PATTERN, operationName));
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
                    Bundle operationBundle = BundleHelper.getBundleByHeader(cache, Operation.OPERATION_NAME, operationBean.getOperation());
                    Operation op = (Operation) operationBundle.loadClass(operationBean.getClassName()).newInstance();
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

    private boolean validate(String str) throws OperationException {
        boolean isValid = true;
        Pattern p = Pattern.compile(String.format(REGEX_VALIDATION,compileOperationRegExp()));
        Matcher matcher = p.matcher(str);
        isValid &=  matcher.find();
        p = Pattern.compile(REGEX_WITHOUT_OPERATION);
        matcher = p.matcher(str);
        isValid &= !matcher.find();
        return isValid;
    }

    private String compileOperationRegExp() throws OperationException {
        final int SIMPLE_MIN = 4, MIN = 0;
        StringBuilder sb = new StringBuilder();
        StringBuilder sbSimple = new StringBuilder();
        StringBuilder sbTemp = new StringBuilder();
        List<String> operations = BundleHelper.getHeader(cache, Operation.OPERATION_NAME);
        sbSimple.append("[");
        for(String operation : operations) {
            if(operation.length() == 1) {
                sbTemp.append(operation);
            } else {
                sb.append("|");
                sb.append(operation);
            }
        }
        sbSimple.append(Pattern.quote(sbTemp.toString()));
        sbSimple.append("]");
        if(sb.length() == MIN && sbSimple.length() < SIMPLE_MIN) {
            throw new OperationException("Operations weren't present in system");
        }
        if(sbSimple.length() > SIMPLE_MIN && sb.length() > MIN) {
            sbSimple.append(sb.toString());
            return sbSimple.toString();
        } else if(sbSimple.length() > SIMPLE_MIN) {
            return sbSimple.toString();
        } else {
            sb.replace(0, 1, "");
            return sb.toString();
        }
    }

    private void initPresentedOperation() {
        createSet();
        for(Bundle operationBundle : cache) {
            OperationBean operationBean = new OperationBean();
            operationBean.setClassName(BundleHelper.getHeader(operationBundle, Operation.OPERATION_CLASS));
            operationBean.setOperation(BundleHelper.getHeader(operationBundle, Operation.OPERATION_NAME));
            operationBean.setRank(Integer.parseInt(BundleHelper.getHeader(operationBundle, Operation.OPERATION_RANK)));
            presentedOperations.add(operationBean);
        }
    }

    private void validateOperations(String input) throws OperationException {
        Set<String> operationNames = new HashSet<>();
        for(OperationBean operation : presentedOperations) {
            operationNames.add(operation.getOperation());
        }
        for(String inputOperation : input.split("[()\\s0-9.]")) {
            if(!"".equals(inputOperation) && !operationNames.contains(inputOperation)) {
                throw new OperationException("Operation doesn't present in system \"" + inputOperation + "\"");
            }
        }
    }
}
