package com.zetsubou_0.java8.investigation.streamapi;

import java.util.Arrays;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class Map {

    public static void main(String[] args) {
        Stream<String> words = Stream.of("Java", "Magazine", "is", "the", "best");

        words.map(str -> str.split(""))
                .flatMap(Arrays::stream)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .forEach((x, y) -> System.out.println(x + " -> " + y));
    }
}
