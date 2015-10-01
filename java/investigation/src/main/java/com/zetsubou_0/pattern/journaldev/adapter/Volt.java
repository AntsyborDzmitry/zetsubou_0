package com.zetsubou_0.pattern.journaldev.adapter;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class Volt {
    private Integer volt;

    public Volt(int volt) {
        this.volt = volt;
    }

    public Integer getVolt() {
        return volt;
    }

    public void setVolt(Integer volt) {
        this.volt = volt;
    }

    @Override
    public String toString() {
        return volt.toString();
    }
}
