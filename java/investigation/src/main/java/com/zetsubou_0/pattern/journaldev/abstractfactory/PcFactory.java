package com.zetsubou_0.pattern.journaldev.abstractfactory;

import com.zetsubou_0.pattern.journaldev.abstractfactory.ComputerAbstractFactory;
import com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Computer;
import com.zetsubou_0.pattern.journaldev.abstractfactory.bean.PC;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class PcFactory implements ComputerAbstractFactory {
    private String hd;
    private String ram;
    private String cpu;

    public PcFactory(String hd, String ram, String cpu) {
        this.hd = hd;
        this.ram = ram;
        this.cpu = cpu;
    }

    @Override
    public Computer createComputer() {
        return new PC(hd, ram, cpu);
    }
}
