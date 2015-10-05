package com.zetsubou_0.pattern.journaldev.state;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class StartAction implements State {
    @Override
    public void doAction() {
        System.out.println("Start");
    }
}
