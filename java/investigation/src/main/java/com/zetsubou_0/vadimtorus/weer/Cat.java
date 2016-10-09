package com.zetsubou_0.vadimtorus.weer;

public class Cat extends Animal {

    public Cat() {
        this(2, "short");
    }

    public Cat(final int eyes) {
        super(eyes);
    }

    public Cat(final int eyes, final String furType) {
        super(eyes);
        this.furType = furType;
    }

    @Override
    public void printInfo() {
        System.out.print("Cat - ");
        super.printInfo();
    }
}
