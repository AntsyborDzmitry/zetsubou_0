package com.zetsubou_0.pattern.journaldev.factory.bean;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class AbstractComputer implements Computer {
    protected String hd;
    protected String ram;
    protected String cpu;

    public AbstractComputer(String hd, String ram, String cpu) {
        this.hd = hd;
        this.ram = ram;
        this.cpu = cpu;
    }

    @Override
    public String getHD() {
        return hd;
    }

    @Override
    public String getRAM() {
        return ram;
    }

    @Override
    public String getCPU() {
        return cpu;
    }
}
