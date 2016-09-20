package com.zetsubou_0.java8.investigation.functionalinterface;

@FunctionalInterface
public interface RunnableWithObjectmethods {

    boolean equals(Object o);

    int hashCode();

    String toString();

    void run();
}
