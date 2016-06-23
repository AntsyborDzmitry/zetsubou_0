package com.zetsubou_0.torus.cat;

/**
 * Created by zetsubou_0 on 23.06.2016.
 */
public class Parent {
    protected final String name;

    public Parent(final String name) {
        this.name = name;
    }

    public String getMother() {
        return "no mother";
    }

    public String getFather() {
        return "no father";
    }
}
