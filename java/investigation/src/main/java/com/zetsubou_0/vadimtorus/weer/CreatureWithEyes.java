package com.zetsubou_0.vadimtorus.weer;

import java.util.List;

public abstract class CreatureWithEyes implements Creature {

    private int eyes;

    public CreatureWithEyes() {
        this(2);
    }

    public CreatureWithEyes(final int eyes) {
        this.eyes = eyes;
    }

    @Override
    public int getEyesNum() {
        return eyes;
    }

    @Override
    public void collect(final List<Creature> creatures) {
        creatures.add(this);
    }

    protected int getEyes() {
        return eyes;
    }
}
