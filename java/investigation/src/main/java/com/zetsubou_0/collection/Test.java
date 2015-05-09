package com.zetsubou_0.collection;

import java.util.LinkedList;

/**
 * Created by Kiryl_Lutsyk on 2/2/2015.
 */
public class Test {
    public static void main(String[] args) {
        LinkedList<Integer> list = new LinkedList<Integer>();

        list.add(0);
        list.offer(3);
        list.offer(5);
        list.push(2);
        list.push(1);

        System.out.println(list);
    }
}
