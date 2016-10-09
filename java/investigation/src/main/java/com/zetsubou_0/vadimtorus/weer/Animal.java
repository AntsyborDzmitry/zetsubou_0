package com.zetsubou_0.vadimtorus.weer;

public abstract class Animal extends CreatureWithEyes {

    private static final int FEET_COUNT = 4;

    protected String furType;

    public Animal() {
        super();
    }

    public Animal(final int eyes) {
        super(eyes);
    }

    public String getFurType() {
        return furType;
    }

    @Override
    public void printInfo() {
        System.out.println("Animal\nfeet:" + FEET_COUNT + ",furType:" + furType + ",eyes:" + getEyes());
    }

    public int getFeet() {
        return FEET_COUNT;
    }
}
