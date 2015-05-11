package com.zetsubou_0.generic;

/**
 * Created by Kiryl_Lutsyk on 12/5/2014.
 */
public class Generic7<T, V> {
    private T obj1;
    private V obj2;

    public Generic7(T obj1, V obj2) {
        this.obj1 = obj1;
        this.obj2 = obj2;
    }

    public void set(T obj1) {
        this.obj1 = obj1;
    }

//    public void set(V obj2) {
//        this.obj2 = obj2;
//    }
}