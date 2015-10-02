package com.zetsubou_0.pattern.journaldev.bridge;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public abstract class AbstractShape implements Shape {
    protected Color color;

    public AbstractShape(Color color) {
        this.color = color;
    }

    @Override
    public void draw() {
        System.out.println("Draw " + this.getClass().getName() + " filled with " + color.applyColor());
    }
}
