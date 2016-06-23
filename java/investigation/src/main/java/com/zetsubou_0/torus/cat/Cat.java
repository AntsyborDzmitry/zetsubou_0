package com.zetsubou_0.torus.cat;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by zetsubou_0 on 23.06.2016.
 */
public class Cat {
    private static final String OUTPUT = "Cat name is %s, %s, %s";

    private final String name;

    private final Parent parent;

    public Cat(final String name, final Parent parent) {
        this.name = name;
        this.parent = parent != null ? parent : new Parent(StringUtils.EMPTY);
    }

    @Override
    public String toString() {
        return String.format(OUTPUT, name, parent.getMother(), parent.getFather());
    }
}
