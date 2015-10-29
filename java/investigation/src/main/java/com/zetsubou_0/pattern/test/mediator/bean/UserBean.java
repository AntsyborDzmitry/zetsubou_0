package com.zetsubou_0.pattern.test.mediator.bean;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class UserBean {
    protected static long idKey = 0;
    private long id = idKey++;
    private String name;

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
