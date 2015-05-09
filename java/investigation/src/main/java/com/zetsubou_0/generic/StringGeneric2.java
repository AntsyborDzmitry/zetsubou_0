package com.zetsubou_0.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class StringGeneric2 extends Generic1<String> implements Generic2 {
    public StringGeneric2(String o) {
        super(o);
    }

    @Override
    public String getObj() {
        return getO();
    }
}
