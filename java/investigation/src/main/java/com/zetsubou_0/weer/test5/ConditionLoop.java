package com.zetsubou_0.weer.test5;


import com.zetsubou_0.weer.been.Person;

/**
 * Created by zetsubou_0 on 22.07.16.
 */
public class ConditionLoop {
    public static void main(String[] args) {
        int y = 1;
        int x = 1;

        String answer;
        if (x > 10) {
            answer = "x > 10";
        } else if(x > 0) {
            answer = "x > 0";
        } else {
            answer = "?";
        }

        answer = x > 10 ? "x > 10" : "x <= 10";

        x = 10;
        while (x > 5) {
            System.out.println(x);
            x -= 1;
        }

        for (int i = 10; i > 5; i = i - 2) {
            System.out.println(i);
        }

        Person[] persons = new Person[] {
                new Person("Vadim", 27),
                new Person("neko", 2),
                new Person("qwe", 10)
        };

        for (int i = 0; i < persons.length; i++) {
            System.out.println(persons[i]);
        }

        for (Person person : persons) {
            System.out.println(person);
        }
    }
}
