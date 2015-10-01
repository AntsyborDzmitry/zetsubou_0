package com.zetsubou_0.pattern.journaldev.factory;

import com.zetsubou_0.pattern.journaldev.factory.bean.Computer;
import com.zetsubou_0.pattern.journaldev.factory.bean.PC;
import com.zetsubou_0.pattern.journaldev.factory.bean.Server;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class ComputerFactory {
    public static Computer getComputer(Types type, String ram, String hd, String cpu) {
        if(type == Types.PC) {
            return new PC(hd, ram, cpu);
        } else if(type == Types.SERVER) {
            return new Server(hd, ram, cpu);
        }
        return null;
    }
}
