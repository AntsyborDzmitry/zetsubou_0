package com.zetsubou_0.java8.codewars;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Created by zetsubou_0 on 01.05.16.
 */
public class CodeWars {
    public static void main(String[] args) {
        String string = "How can mirrors be real if our eyes aren't real";
        if (string == null || string.length() < 1) {
            return;
        }
        String result = Arrays.stream(string.split("\\s+"))
                .map(str -> str.substring(0, 1).toUpperCase() + str.substring(1))
                .collect(Collectors.joining(" "));
        System.out.println(result);

        List<Integer> vowels = Arrays.asList('a', 'A', 'e', 'E', 'i', 'I', 'o', 'O', 'u', 'U')
                .stream()
                .map(x -> (int) x)
                .collect(Collectors.toList());
        long count = string.chars()
                .filter(vowels::contains)
                .count();
        System.out.println(count);
    }


}
