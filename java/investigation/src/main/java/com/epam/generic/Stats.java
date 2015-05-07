package com.epam.generic;

/**
 * Created by Kiryl_Lutsyk on 12/4/2014.
 */
public class Stats<T extends Number> {
    private T[] nums;

    public Stats(T[] nums) {
        this.nums = nums;
    }

    public double getAvg() {
        double avg = 0.0;

        for(T n: nums) {
            avg += n.doubleValue();
        }

        return avg / nums.length;
    }

    public boolean sameAvg(Stats<?> stats) {
        return (getAvg() == stats.getAvg());
    }

    public double getAfterPoint(Stats<? extends Double> n) {
        return n.getAvg() % 1;
    }

}
