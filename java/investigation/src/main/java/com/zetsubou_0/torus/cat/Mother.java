package com.zetsubou_0.torus.cat;

/**
 * Created by zetsubou_0 on 23.06.2016.
 */
public class Mother extends Parent {

    public Mother(final String name) {
        super(name);
    }

    @Override
    public String getMother() {
        return "mother is " + name;
    }
}
