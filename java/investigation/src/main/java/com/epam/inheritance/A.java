package com.epam.inheritance;

/**
 * Created by Kiryl_Lutsyk on 12/17/2014.
 */
public class A {
    int a = 10;

    public void method() {
        System.out.println("A");
    }

    static {
        System.out.println("Static A");
    }

    {
        System.out.println("Block A");
    }
}
