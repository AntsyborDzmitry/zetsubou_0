package com.zetsubou_0.pattern.journaldev.composite;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Kiryl_Lutsyk on 10/1/2015.
 */
public class CompositeShape implements Shape {
    private List<Shape> shapes = new ArrayList<>();

    @Override
    public void draw() {
        for(Shape shape : shapes) {
            shape.draw();
        }
    }

    public void add(Shape shape) {
        shapes.add(shape);
    }

    public void remove(Shape shape) {
        shapes.remove(shape);
    }
}
