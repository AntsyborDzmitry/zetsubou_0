package com.zetsubou_0.pattern.test.composite;

/**
 * Created by Kiryl_Lutsyk on 10/30/2015.
 */
public class Test {
    public static void main(String[] args) {
        Employee e1 = new Developer("a", 1);
        Employee e2 = new Manager("b", 10);
        Employee e3 = new Developer("c", 2);
        Employee e4 = new Developer("d", 3);
        Employee e5 = new Manager("e", 20);
        Employee e6 = new Developer("f", 4);
        e1.add(e2);

        e2.add(e1);
        e2.add(e3);
        e2.add(e4);

        e5.add(e6);
        e5.add(e2);

        e5.info();
    }
}
