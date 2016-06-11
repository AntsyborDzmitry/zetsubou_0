package com.zetsubou_0.torus.parsestring;

import org.apache.commons.lang3.StringUtils;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class TestsRepresentation {

    private static final String VERSION_PATTERN_STRING = "((\\d+)(\\t|\\n)*?(\\w+)(\\t|\\n)*?)+";

    private static final Pattern VERSION_PATTERN = Pattern.compile(VERSION_PATTERN_STRING);

    private final int NUM_GROUP = 2;

    private static int LITERAL_GROUP = 4;

    private final String input;

    private Map<Integer, String> versions = new TreeMap<>();

    public TestsRepresentation(final String input) {
        this.input = input;
        initVersions();
    }

    private void initVersions() {
        Matcher matcher = VERSION_PATTERN.matcher(input);
        while (matcher.find()) {
            String indexString = matcher.group(NUM_GROUP);
            String literalString = matcher.group(LITERAL_GROUP);
            if (StringUtils.isBlank(indexString) && StringUtils.isBlank(literalString)) {
                continue;
            }
            try {
                versions.put(Integer.parseInt(indexString), literalString);
            } catch (IllegalFormatException e) {
                //todo: implement logging for invalid numbers
            }
        }
    }

    public String getTestLiteralByNumberIfExists(final int testNumber) {
        String value = versions.get(testNumber);
        if (StringUtils.isBlank(value)) {
            return StringUtils.EMPTY;
        }
        return value;
    }
}
