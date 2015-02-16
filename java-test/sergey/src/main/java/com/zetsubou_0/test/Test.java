package com.zetsubou_0.test;

import com.zetsubou_0.test.p1.Human;

/**
 * Created by zetsubou_0 on 02.02.15.
 */
public class Test {
    public static void main(String[] args) {
        Human human1 = new Human();
        Human human2 = new Human(35);
        Human human3 = new Human("Kiryl", "Lutsyk", 27, 78.5, 181.1F);

        System.out.println(human1);
        System.out.println(human2);
        System.out.println(human3);


    }
}
