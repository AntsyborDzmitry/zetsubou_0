package com.zetsubou_0.thread.synchronizer.been;

/**
 * Created by Kiryl_Lutsyk on 10/27/2016.
 */
public class Cat {
    final String name;
    final int age;

    public Cat(final String name, final int age) {
        this.name = name;
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public int getAge() {
        return age;
    }

    @Override
    public String toString() {
        return name + " " + age;
    }
}
