package com.zetsubou_0.test.dima.bean.item;

/**
 * Created by zetsubou_0 on 31.1.15.
 */
public class Product {
    private long trackCode;
    private String name;
    private int cost;

    public Product() {
    }

    public long getTrackCode() {
        return trackCode;
    }

    public void setTrackCode(long trackCode) {
        this.trackCode = trackCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCost() {
        return cost;
    }

    public void setCost(int cost) {
        this.cost = cost;
    }
}
