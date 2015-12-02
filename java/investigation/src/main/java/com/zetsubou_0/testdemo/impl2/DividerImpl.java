package com.zetsubou_0.testdemo.impl2;

import com.zetsubou_0.testdemo.api.Divider;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class DividerImpl implements Divider {
    @Override
    public double divide(final double x, final double y) throws IllegalArgumentException {
        if (y == 0) {
            throw new IllegalArgumentException("Divider Service can't divide by 0");
        }
        return x / y;
    }
}
