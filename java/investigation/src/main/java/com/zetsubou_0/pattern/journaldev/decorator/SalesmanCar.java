package com.zetsubou_0.pattern.journaldev.decorator;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class SalesmanCar implements Car {
    @Override
    public void drive() {
        System.out.println("Drive salesman car");
    }
}
