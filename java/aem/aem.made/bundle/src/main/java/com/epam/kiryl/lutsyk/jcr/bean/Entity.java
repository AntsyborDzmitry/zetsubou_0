package com.epam.kiryl.lutsyk.jcr.bean;

import java.util.Date;

/**
 * Created by Kiryl_Lutsyk on 8/7/2015.
 */

public class Entity {

    private Integer count;
    private Date date;
    private String name;

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
