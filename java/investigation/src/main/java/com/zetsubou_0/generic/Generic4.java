package com.zetsubou_0.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Generic4 <T> {
    private T obj;

    public Generic4(T obj) {
        this.obj = obj;
    }

    public T getObj() {
        return obj;
    }

    public Class<?> getCl() {
        return obj.getClass();
    }
}
