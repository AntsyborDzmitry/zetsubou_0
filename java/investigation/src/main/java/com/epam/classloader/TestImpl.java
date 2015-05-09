package com.epam.classloader;

/**
 * Created by Kiryl_Lutsyk on 12/15/2014.
 */
public class TestImpl implements Test {
    private static int i = 0;

    @Override
    public int increment() {
        return i++;
    }
}
