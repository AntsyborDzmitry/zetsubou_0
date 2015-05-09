package com.epam.memmory;

/**
 * Created by Kiryl_Lutsyk on 12/17/2014.
 */
public class RefTest {
    public static void action(int a, int[] b, int c[]) {
        a += 10;
        b[0] += 10;
        c = new int[] {10};
    }
}
