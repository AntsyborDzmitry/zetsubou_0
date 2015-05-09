package com.epam.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Generic2Impl<T> implements Generic2<T> {
    private T obj;

    public Generic2Impl(T o) {
        obj = o;
    }

    @Override public T getObj() {
        return obj;
    }
}
