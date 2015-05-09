package com.epam.generic;

/**
 * Created by Kiryl_Lutsyk on 12/5/2014.
 */
public class Generic9 extends Generic8<String> {
    public Generic9(String obj) {
        super(obj);
    }

    public String getObj() {
        System.out.println(obj.getClass());
        return obj;
    }
}
