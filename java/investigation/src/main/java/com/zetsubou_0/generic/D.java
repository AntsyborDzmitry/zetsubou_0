package com.zetsubou_0.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class D {
    public static <T, V extends T> boolean isIn(T t, V[] v) {
        for(V x: v) {
            if(x.equals(t)) {
                return true;
            }
        }
        return false;
    }

    public static <T extends Number> Number isIn2(T t) {
        return t;
    }
}
