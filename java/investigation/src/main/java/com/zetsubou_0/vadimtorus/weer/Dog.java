package com.zetsubou_0.vadimtorus.weer;

public class Dog extends Animal {

    public Dog() {
        this(2, "long");
    }

    public Dog(final int eyes) {
        super(eyes);
    }

    public Dog(final int eyes, final String furType) {
        super(eyes);
        this.furType = furType;
    }

    @Override
    public void printInfo() {
        System.out.print("Dog - ");
        super.printInfo();
    }
}
