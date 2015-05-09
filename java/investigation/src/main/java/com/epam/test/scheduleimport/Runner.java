package com.epam.test.scheduleimport;

/**
 * Created by Kiryl_Lutsyk on 4/1/2015.
 */
public class Runner {
    public static void main(String[] args) {
        ScheduleManagerImpl sm = new ScheduleManagerImpl();
        System.out.println(sm.fixShowName("a\na\na\n a"));
    }
}
