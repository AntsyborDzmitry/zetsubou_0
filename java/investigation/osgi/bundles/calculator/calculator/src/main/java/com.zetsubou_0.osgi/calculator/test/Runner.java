package com.zetsubou_0.osgi.calculator.test;

import com.zetsubou_0.osgi.api.Operation;
import com.zetsubou_0.osgi.api.exception.OperationException;
import com.zetsubou_0.osgi.calculator.bean.OperationBean;
import com.zetsubou_0.osgi.calculator.bean.OperationGroupBean;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created by Kiryl_Lutsyk on 9/7/2015.
 */
public class Runner {
    private static final String PARENTHESIS_PATTERN = "([(\\s/0-9.]|[%s]|#group([0-9.]+)#)+[)]";
    private static final String PARENTHESIS_PATTERN_2 = "[(]([\\s%s0-9.]|#group([0-9.]+)#)+[)]";
    private static final String PARENTHESIS_PATTERN_3 = "^[(](.*)[)]$";
    private static final String GROUP_PATTERN = "([0-9.]+|#group([0-9.]+)#)[\\s]*([\\%s])[\\s]*([0-9.]+|#group([0-9.]+)#)";
    private static final String REGEX_GROUP = "^[\\s(]#group[0-9]+#[\\s)]$";
    private static final String OPERATION = "#group%s#";

    private static Set<OperationBean> presentedOperations;
    private static Map<Integer, OperationGroupBean> groups = new HashMap<>();
    private static int operationNumber = 0;
    private static OperationGroupBean last = new OperationGroupBean();

    public static void main(String[] args) {
        String input = "(2 / 4 - ((3 + 2 * 7) * 2 + 3 pow 4)) pow 2";

//        createSet();
//        fillOperations();
//
//        try {
//            parseInput(removeFirstParenthesis(input));
//            System.out.println(last.getValue());
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        } catch (ClassNotFoundException e) {
//            e.printStackTrace();
//        } catch (InstantiationException e) {
//            e.printStackTrace();
//        } catch (OperationException e) {
//            e.printStackTrace();
//        }

        Pattern pattern = Pattern.compile(PARENTHESIS_PATTERN);
        Matcher matcher = pattern.matcher(input);
        while(matcher.find()) {
            System.out.println(matcher.group());
        }
    }

    private static void parseInput(String input) throws IllegalAccessException, ClassNotFoundException, InstantiationException {
        if(input == null || "".equals(input)) {
            return;
        }
        Pattern pattern = Pattern.compile(String.format(PARENTHESIS_PATTERN, Pattern.quote("+-*/")));
        Matcher matcher = pattern.matcher(input);
        if(matcher.find()) {
            String foundString = matcher.group();
            if(foundString != null || !"".equals(foundString)) {
                pattern = Pattern.compile(String.format(PARENTHESIS_PATTERN_2, Pattern.quote("+-*/")));
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

    private static OperationGroupBean parseGroup(String group, String input) throws IllegalAccessException, InstantiationException, ClassNotFoundException {
        OperationGroupBean operationGroup = new OperationGroupBean();
        int operationNum = operationNumber;
        groups.put(operationNumber++, operationGroup);
        operationGroup = parsePriorityGroup(group);
        groups.put(operationNum, operationGroup);

        return operationGroup;
    }

    private static OperationGroupBean parsePriorityGroup(String group) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        OperationGroupBean operationGroup = new OperationGroupBean();

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


        return operationGroup;
    }

    private static void fillOperations() {
        OperationBean operation = new OperationBean();
        operation.setOperation("+");
        operation.setRank(10);
        operation.setClassName("com.zetsubou_0.osgi.calculator.test.Add");
        presentedOperations.add(operation);

        operation = new OperationBean();
        operation.setOperation("-");
        operation.setRank(10);
        operation.setClassName("com.zetsubou_0.osgi.calculator.test.Subtract");
        presentedOperations.add(operation);

        operation = new OperationBean();
        operation.setOperation("*");
        operation.setRank(20);
        operation.setClassName("com.zetsubou_0.osgi.calculator.test.Multiplication");
        presentedOperations.add(operation);

        operation = new OperationBean();
        operation.setOperation("cat");
        operation.setRank(20);
        operation.setClassName("com.zetsubou_0.osgi.calculator.test.Multiplication");
        presentedOperations.add(operation);

        operation = new OperationBean();
        operation.setOperation("/");
        operation.setRank(20);
        operation.setClassName("com.zetsubou_0.osgi.calculator.test.Division");
        presentedOperations.add(operation);
    }

    private static void createSet() {
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

    private static String removeFirstParenthesis(String input) {
        if(input.matches(PARENTHESIS_PATTERN_3)) {
            Pattern pattern = Pattern.compile(PARENTHESIS_PATTERN_3);
            Matcher matcher = pattern.matcher(input);
            if(matcher.find()) {
                return matcher.group(1);
            }
        }
        return input;
    }
}
