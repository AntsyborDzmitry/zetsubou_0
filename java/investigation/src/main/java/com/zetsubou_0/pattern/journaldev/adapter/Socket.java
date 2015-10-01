package com.zetsubou_0.pattern.journaldev.adapter;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class Socket {
    private Volt volt = new Volt(220);

    public Volt getVolt() {
        return volt;
    }

    public void setVolt(Volt volt) {
        this.volt = volt;
    }
}
