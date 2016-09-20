package com.zetsubou_0.java8.investigation.bean;

public class Employee {

    private String name;

    private Position position;

    private int age;

    public String getName() {
        return name;
    }

    public void setName(final String name) {
        this.name = name;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(final Position position) {
        this.position = position;
    }

    public int getAge() {
        return age;
    }

    public void setAge(final int age) {
        this.age = age;
    }

    public enum Position {
        DEVELOPER, QA;
    }
}
