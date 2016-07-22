package com.zetsubou_0.weer.test2;

import com.zetsubou_0.weer.been.Person;

public class VariableTest {

    private int i = 1;

    private long x = 2L;

    private float y = 3.0F;

    private double z = 4.0;

    private static String str = "Hello";

    private static byte[] array = str.getBytes();

    private static char ch = 'f';

    private static Object[] objectArray = new Object[2];

    private static int[] intArray = new int[] {10, 2, 3};

    private static Person[] persons = new Person[] {
            new Person("neko", 2),
            new Person("Vadim", 27)
    };

    public static void main(String[] args) {
        for (Person qwe : persons) {
            System.out.println(qwe);
        }
    }
}
