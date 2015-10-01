package com.zetsubou_0.collection;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 2/2/2015.
 */
public class Test {
    public static void main(String[] args) {
        List<String> list1 = new ArrayList<>();
        List<String> list2 = new LinkedList<>();

        list1.add("a");
        list1.add("b");
        list1.add("c");
        list1.add("d");

        Iterator<String> iterator = list1.iterator();
        while(iterator.hasNext()) {
            String str = iterator.next();
            if("b".equals(str)) {
                list1.remove(str);
            }
        }
        System.out.println(list1);
    }
}
