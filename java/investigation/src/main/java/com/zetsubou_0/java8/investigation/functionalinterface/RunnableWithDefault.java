package com.zetsubou_0.java8.investigation.functionalinterface;

@FunctionalInterface
public interface RunnableWithDefault {

    default void defaultMethod() {}

    void run();
}
