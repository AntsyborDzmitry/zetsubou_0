package com.zetsubou_0.generic;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Runner {
    public static void main(String ... args) {
        Generic1<String> someStr = new Generic1<String>("Test str");
//        System.out.println(someStr.getO());
        Generic3<StringGeneric2> g3 = new Generic3<StringGeneric2>(new StringGeneric2("Test"));
//        System.out.println(g3.getObj().getObj());

        Stats<Double> s1 = new Stats<Double>(new Double[]{1.0, 2.0, 3.0, 4.0, 5.1});
        Stats<Integer> s2 = new Stats<Integer>(new Integer[]{1, 2, 3});
//        System.out.println(s1.sameAvg(s2));
//        System.out.println(s2.getAfterPoint(s1));
        C<A> c = new C<A>();
        Generic4 g4 = new Generic4("Test");
//        System.out.println(g4.getCl());
//        System.out.println(g4.getClass());
//        System.out.println(s1 instanceof Stats<?>);
        Generic5<Generic5<Double, Long>, String> g5 = new Generic5<Generic5<Double, Long>, String>(new Generic6<Double, Long>(1.0, 1L), "");
        Generic9 g9 = new Generic9("G9");
//        System.out.println(g9.getObj());
        List<String> l = new ArrayList<String>();
        List<Double> l2 = new ArrayList<Double>();
//        System.out.println(l.getClass() == l2.getClass());
        B<Number> bn = new B<Number>();
        System.out.println(D.isIn2(1));
    }
}
