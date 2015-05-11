package com.zetsubou_0.memmory;

/**
 * Created by Kiryl_Lutsyk on 12/17/2014.
 */
public class StackAnalyzer {
    private long count = 0;
    private long count5 = 0;

    public void increment() {
        count++;
        increment();
    }

    public void increment5() {
        count5 += 5;
        increment5();
    }

    public long getCount() {
        return count;
    }

    public long getCount5() {
        return count5;
    }
}
