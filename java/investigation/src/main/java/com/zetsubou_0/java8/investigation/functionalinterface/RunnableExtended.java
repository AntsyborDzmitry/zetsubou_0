package com.zetsubou_0.java8.investigation.functionalinterface;

@FunctionalInterface
public interface RunnableExtended extends Runnable {
    default void doNothing() {}
}
