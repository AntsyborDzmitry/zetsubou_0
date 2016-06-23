package com.zetsubou_0.torus.cat;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by zetsubou_0 on 23.06.2016.
 */
public class Runner {
    public static void main(String[] args) {
        List<Cat> cats = new ArrayList<>();
        cats.add(new Cat("1", null));
        cats.add(new Cat("2", new Parent("")));
        cats.add(new Cat("3", new Father("1")));
        cats.add(new Cat("4", new Mother("2")));
        cats.add(new Cat("5", new Father("3")));
        cats.add(new Cat("6", new Mother("4")));

        for(Cat cat : cats) {
            System.out.println(cat);
        }
    }
}
