package com.zetsubou_0.java8.investigation.comparator;

import com.zetsubou_0.java8.investigation.bean.Employee;

import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;

public class ComparatorTest {

    private static final Comparator<Employee> NAME_COMPARATOR = Comparator.comparing(Employee::getName);

    private static final Comparator<Employee> AGE_COMPARATOR = Comparator.comparing(Employee::getAge);

    private static final Comparator<Employee> POSITION_COMPARATOR = Comparator.comparing(Employee::getPosition);

    public static void main(String[] args) {
        List<Employee> employees = Arrays.asList(
                new Employee("qwe", Employee.Position.DEVELOPER, 20),
                new Employee("asd", Employee.Position.DEVELOPER, 21),
                new Employee("zxc", Employee.Position.QA, 22),
                new Employee("qert", Employee.Position.DEVELOPER, 23)
        );

        System.out.println(employees);

        Collections.sort(employees, NAME_COMPARATOR.thenComparing(POSITION_COMPARATOR).thenComparing(AGE_COMPARATOR));
        System.out.println(employees);
    }
}
