package com.zetsubou_0.osgi.figure;

import com.zetsubou_0.osgi.api.paint.Figure;

/**
 * Created by Kiryl_Lutsyk on 9/3/2015.
 */
public class Shape implements Figure {
    @Override
    public void printInfo() {
        System.out.println("Shape");
    }
}
