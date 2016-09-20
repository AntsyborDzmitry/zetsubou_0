package com.zetsubou_0.java8.investigation.lambda;

import com.sun.istack.internal.NotNull;

import java.util.Comparator;

public class Test {

    private Comparator<String> c1 = (str1, str2) -> {return str1.length() - str2.length();};

    private Comparator<String> c2 = (@NotNull final String str1, @NotNull final String str2) ->
            str1.length() - str2.length();

    public void doAction() {
        new Thread(() -> System.out.println("Start"));
    }
}
