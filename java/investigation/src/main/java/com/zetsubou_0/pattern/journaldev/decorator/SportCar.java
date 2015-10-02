package com.zetsubou_0.pattern.journaldev.decorator;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class SportCar implements Car {
    private Car car;

    public SportCar(Car car) {
        this.car = car;
    }

    @Override
    public void drive() {
        System.out.println(car.getClass().getName() + " was updated to sport car");
    }
}
