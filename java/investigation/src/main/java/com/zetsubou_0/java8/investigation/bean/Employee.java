package com.zetsubou_0.java8.investigation.bean;

public class Employee {

    private static final String PRINT_INFO = "Name: %s, Age: %d, Position: %s";

    private String name;

    private Position position;

    private int age;


    public Employee() {
    }

    public Employee(final String name, final Position position, final int age) {
        this.name = name;
        this.position = position;
        this.age = age;
    }

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

    @Override
    public String toString() {
        return String.format(PRINT_INFO, name, age, position);
    }

    public enum Position {
        DEVELOPER, QA;

        @Override
        public String toString() {
            return super.toString().toLowerCase();
        }
    }
}
