package com.zetsubou_0.pattern.test.mediator.bean;

import java.util.Set;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class RoomBean {
    protected int id;
    protected String description;
    protected Set<UserBean> userBeans;

    public int getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public Set<UserBean> getUserBeans() {
        return userBeans;
    }
}
