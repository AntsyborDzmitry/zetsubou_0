package com.zetsubou_0.pattern.test.composite;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
public interface Employee {
    void add(Employee employee);
    void remove(Employee employee);
    void info();
}
