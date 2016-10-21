package com.zetsubou_0.java8.investigation.bean;

public class Transaction {

    private static final String DATA = "[ID: %d, value: %d, city: %s]";

    private int id;

    private int value;

    private String city;

    public int getValue() {
        return value;
    }

    public void setValue(final int value) {
        this.value = value;
    }

    public int getId() {
        return id;
    }

    public void setId(final int id) {
        this.id = id;
    }

    public String getCity() {
        return city;
    }

    public void setCity(final String city) {
        this.city = city;
    }

    @Override
    public String toString() {
        return String.format(DATA, id, value, city);
    }
}
