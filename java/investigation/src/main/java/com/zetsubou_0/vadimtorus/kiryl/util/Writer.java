package com.zetsubou_0.vadimtorus.kiryl.util;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

import java.io.PrintStream;
import java.util.List;

public class Writer {

    private final PrintStream out;

    public Writer(final PrintStream out) {
        this.out = out;
    }

    public String buildEventToString(final String type, final Object ... marks) {
        StringBuilder toStringAnswer = new StringBuilder(String.format(Constants.TYPE, type));
        for (Object mark : marks) {
            toStringAnswer.append(String.format(Constants.PARAMETER, mark));
        }
        return toStringAnswer.toString();
    }

    public void printEvents(final String title, final List<Event> events) {
        out.println(title);
        events.forEach(out::println);
        out.println();
    }

    public void printEvent(final String title, final Event event, final String errorMessage) {
        if (event == null) {
            out.println(errorMessage);
            out.println();
            return;
        }
        out.println(title);
        out.println(event);
        out.println();
    }
}
