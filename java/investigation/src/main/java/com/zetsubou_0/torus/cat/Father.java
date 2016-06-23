package com.zetsubou_0.torus.cat;

/**
 * Created by zetsubou_0 on 23.06.2016.
 */
public class Father extends Parent {
    public Father(final String name) {
        super(name);
    }

    @Override
    public String getFather() {
        return "father is " + name;
    }
}
