package com.zetsubou_0.pattern.journaldev.flyweight;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class Orb implements Shape {
    private boolean is3D;

    public Orb(boolean is3D) {
        this.is3D = is3D;
    }

    @Override
    public void draw() {
        if(is3D) {
            System.out.println("Circle in 3D");
        } else {
            System.out.println("Circle");
        }
    }
}
