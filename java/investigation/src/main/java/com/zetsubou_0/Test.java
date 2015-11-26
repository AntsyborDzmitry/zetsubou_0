package com.zetsubou_0;

import org.apache.commons.lang3.StringUtils;

/**
 * Created by Kiryl_Lutsyk on 11/25/2015.
 */
public class Test {
    private static final String TAG_REGEX = ".*<\\/?[%s]>.*";
    private static final String ORDERED_LIST_REGEX = "^\\s*(\\d)+[.].+";
    private static final String UNORDERED_LIST_REGEX = "^\\s*(&bull;)+.+";
    private static final String NEW_LINE = "\n";
    private static final String OPEN_B = "<b>";
    private static final String OPEN_I = "<i>";
    private static final String OPEN_U = "<u>";
    private static final String OPEN_P = "<p>";
    private static final String OPEN_UL = "<ul>";
    private static final String OPEN_OL = "<ol>";
    private static final String OPEN_LI = "<li>";
    private static final String CLOSE_B = "</b>";
    private static final String CLOSE_I = "</i>";
    private static final String CLOSE_U = "</u>";
    private static final String CLOSE_P = "</p>";
    private static final String CLOSE_UL = "</ul>";
    private static final String CLOSE_OL = "</ol>";
    private static final String CLOSE_LI = "</li>";
    private static final String LIST_MARKER = "&bull;";

    private static final String TEST_STRING = "list\n" +
            "&bull; book.\n" +
            "&bull; apple.\n" +
            "1. book\n" +
            "2. apple\n" +
            "That's it.\n" +
            "I think.";
//    private static final String TEST_STRING = "\n1. book";

    private static boolean isOlOpen = false;
    private static boolean isUlOpen = false;

    public static void main(String[] args) {
        StringBuilder text = new StringBuilder();

        String strParts[] = TEST_STRING.split(NEW_LINE);

        for (String s : strParts) {
            if (s.matches(ORDERED_LIST_REGEX)) {
                checkAndClose(text, true, false);
                if (!isOlOpen) {
                    text.append(OPEN_OL);
                    isOlOpen = true;
                }
                text.append(OPEN_LI);
                text.append(s.replaceAll("^\\s*\\d+[.]", StringUtils.EMPTY));
                text.append(CLOSE_LI);
            } else if (s.matches(UNORDERED_LIST_REGEX)) {
                checkAndClose(text, false, true);
                if (!isUlOpen) {
                    text.append(OPEN_UL);
                    isUlOpen = true;
                }
                text.append(OPEN_LI);
                text.append(s.replaceAll(LIST_MARKER, StringUtils.EMPTY));
                text.append(CLOSE_LI);
            } else {
                checkAndClose(text, true, true);
                text.append(OPEN_P);
                text.append(s);
                text.append(CLOSE_P);
            }
        }
        checkAndClose(text, true, true);
        System.out.println(text.toString());
    }

    private static void checkAndClose(StringBuilder text, boolean isCheckUl, boolean isCheckOl) {
        if (isCheckUl && isUlOpen) {
            text.append(CLOSE_UL);
            isUlOpen = false;
        }
        if (isCheckOl && isOlOpen) {
            text.append(CLOSE_OL);
            isOlOpen = false;
        }
    }
}
