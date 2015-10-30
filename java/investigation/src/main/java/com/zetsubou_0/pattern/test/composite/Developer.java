package com.zetsubou_0.pattern.test.composite;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
public class Developer implements Employee {
    private String name;
    private double salary;

    public Developer(String name, double salary) {
        this.name = name;
        this.salary = salary;
    }

    @Override
    public void add(Employee employee) {

    }

    @Override
    public void remove(Employee employee) {

    }

    @Override
    public void info() {
        System.out.println(name + " - " + salary);
    }
}
