package com.zetsubou_0.pattern.test.composite;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
public class Manager implements Employee {
    private final Set<Employee> employees = new HashSet<>();
    private String name;
    private double salary;

    public Manager(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    @Override
    public void add(Employee employee) {
        employees.add(employee);
    }

    @Override
    public void remove(Employee employee) {
        employees.remove(employee);
    }

    @Override
    public void info() {
        System.out.println(name + " - " + salary);
        for (Employee employee : employees) {
            employee.info();
        }
    }
}
