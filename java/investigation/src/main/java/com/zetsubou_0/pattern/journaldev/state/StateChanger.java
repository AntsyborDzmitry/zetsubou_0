package com.zetsubou_0.pattern.journaldev.state;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public class StateChanger {
    private State state;

    public StateChanger(State state) {
        this.state = state;
    }

    public void doAction() {
        state.doAction();
    }
}
