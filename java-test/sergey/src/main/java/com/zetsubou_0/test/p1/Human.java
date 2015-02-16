package com.zetsubou_0.test.p1;

/**
 * Created by zetsubou_0 on 02.02.15.
 */
public class Human {
    double weight;
    float height;
    int age;

    String firstName;
    String lastName;

    public Human() {
        firstName = "Seirgey";
        lastName = "Timoshenko";
        age = 26;
        weight = 62.5;
        height = 182.1F;
    }

    public Human(int age) {
        this.age = age;
    }

    public Human(String firstName, String lastName, int age, double weight, float height) {
        this.weight = weight;
        this.height = height;
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    @Override
    public String toString() {
        return firstName + " " + lastName + ": \nage: " + age + ", \nweight: " + weight + ", \nheight: " + height + "\n";
    }
}
