package com.epam.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Generic1<T> {
    private T o;

    public Generic1(T o) {
        this.o = o;
    }

    public T getO() {
        return o;
    }

    public void setO(T o) {
        this.o = o;
    }
}
