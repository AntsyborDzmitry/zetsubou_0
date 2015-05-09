package com.epam.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Generic3<T extends Generic1<String> & Generic2> {
    private T obj;

    public Generic3(T obj) {
        this.obj = obj;
    }

    public T getObj() {
        return obj;
    }
}
