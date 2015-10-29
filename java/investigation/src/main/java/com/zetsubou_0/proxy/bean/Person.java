package com.zetsubou_0.proxy.bean;

import java.io.Serializable;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class Person implements Serializable {
    public static final long ID = 123L;

    private String name;
    private int age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }
}
