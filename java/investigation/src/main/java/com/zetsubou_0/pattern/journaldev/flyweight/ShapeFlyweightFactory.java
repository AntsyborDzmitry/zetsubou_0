package com.zetsubou_0.pattern.journaldev.flyweight;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/2/2015.
 */
public class ShapeFlyweightFactory {
    private static final Map<Type, Shape> cache = new HashMap<>();

    public static Shape getShape(Type type) {
        //get from cache
        Shape shape = cache.get(type);
        if(shape == null) {
            if(type == Type.CIRCLE) {
                shape = new Circle();
            } else if(type == Type.ORB_2D) {
                shape = new Orb(false);
            } else if(type == Type.ORB_3D) {
                shape = new Orb(true);
            }

            if(shape != null) {
                cache.put(type, shape);
            }
        }
        return shape;
    }

    public enum Type {
        CIRCLE, ORB_2D, ORB_3D
    }
}
