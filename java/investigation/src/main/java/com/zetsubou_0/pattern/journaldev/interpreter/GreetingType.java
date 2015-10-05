package com.zetsubou_0.pattern.journaldev.interpreter;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Kiryl_Lutsyk on 10/5/2015.
 */
public enum GreetingType {
    ENG, RUS;

    private static final Map<GreetingType, String> GREETINGS = new HashMap<GreetingType, String>() {{
        put(ENG, "Hello ");
        put(RUS, "Привет ");
    }};

    public static String getGreeting(GreetingType type) {
        return GREETINGS.get(type);
    }
}
