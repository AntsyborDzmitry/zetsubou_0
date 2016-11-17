package com.zetsubou_0.java8.investigation.streamapi;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Arrays;

public class UniqueWordsInFile {

    public static void main(String[] args) throws IOException {
        Files.lines(Paths.get(args[0]))
                .map(str -> str.split("\\s+"))      // Stream<String[]>
                .flatMap(Arrays::stream)            // Stream<String>, Arrays.stream(String[] s) -> Stream<String>
                .distinct()
                .forEach(System.out::println);
    }
}
