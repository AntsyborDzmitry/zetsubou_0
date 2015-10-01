package com.zetsubou_0.pattern.journaldev.abstractfactory;

import com.zetsubou_0.pattern.journaldev.abstractfactory.bean.Computer;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class ComputerFactory {
    public static Computer getComputer(ComputerAbstractFactory factory) {
        return factory.createComputer();
    }
}
