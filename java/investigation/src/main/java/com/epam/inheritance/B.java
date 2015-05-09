package com.epam.inheritance;

/**
 * Created by Kiryl_Lutsyk on 12/17/2014.
 */
public class B extends A {
    int a = 25;

    @Override
    public void method() {
        System.out.println("B");
    }

    static {
        System.out.println("Static B");
    }

    {
        System.out.println("Block B");
    }
}
