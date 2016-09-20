package com.zetsubou_0.java8.investigation.methodreference;

public class WorldGreeting extends Greeting {

    public void greeting() {
        // () -> super.hello()
        new Thread(super::hello).start();
    }
}
