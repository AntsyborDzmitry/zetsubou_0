package com.zetsubou_0.pattern.journaldev.abstractfactory;

import com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Computer;
import com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Server;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class ServerFactory implements ComputerAbstractFactory {
    private String hd;
    private String ram;
    private String cpu;

    public ServerFactory(String hd, String ram, String cpu) {
        this.hd = hd;
        this.ram = ram;
        this.cpu = cpu;
    }

    @Override
    public Computer createComputer() {
        return new Server(hd, ram ,cpu);
    }
}
