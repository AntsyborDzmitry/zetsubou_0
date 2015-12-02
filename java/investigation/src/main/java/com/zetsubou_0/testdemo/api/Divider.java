package com.zetsubou_0.testdemo.api;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public interface Divider {
    /**
     * Divide x by y and return result
     *
     * @param x dividend
     * @param y divider
     * @return x / y
     */
    double divide(double x, double y) throws IllegalArgumentException;
}
