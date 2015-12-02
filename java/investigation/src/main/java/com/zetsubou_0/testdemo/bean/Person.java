package com.zetsubou_0.testdemo.bean;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class Person {
    private final String firstName;
    private final String lastName;
    private int age;

    public Person(final String firstName, final String lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public int getAge() {
        return age;
    }

    public void setAge(final int age) {
        this.age = age;
    }
}
