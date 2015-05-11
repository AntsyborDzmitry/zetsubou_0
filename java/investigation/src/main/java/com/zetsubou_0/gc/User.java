package com.zetsubou_0.gc;

/**
 * Created by Kiryl_Lutsyk on 12/23/2014.
 */
public class User {
    private String firstName;
    private String lastName;
    private int age;
    private Birthday birthday;

    public User(String firstName, String lastName, int age, Birthday birthday) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.age = age;
        this.birthday = birthday;
    }
}
