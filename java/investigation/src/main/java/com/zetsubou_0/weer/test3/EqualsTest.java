package com.zetsubou_0.weer.test3;

import com.zetsubou_0.weer.been.Person;
import com.zetsubou_0.weer.been.Student;

public class EqualsTest {
    public static void main(String[] args) {
        Person p1 = new Person("Vadim", 27);
        Person p2 = new Person("Vadim", 27);
        Person p3 = p1;
        Person p4 = new Student("Vadim", 27);
        System.out.println(p1.equals(p2));
        System.out.println(p1.equals(p4));
    }
}
