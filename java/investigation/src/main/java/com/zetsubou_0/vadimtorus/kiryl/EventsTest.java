package com.zetsubou_0.vadimtorus.kiryl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.kiryl.util.EventFileReader;

import java.io.IOException;
import java.util.List;

public class EventsTest {
    public static void main(String[] args) {
        try {
            List<Event> events = EventFileReader.readData("test");
            print(events);
        } catch (InvalidMarkValueException | IOException e) {
            e.printStackTrace();
        }

    }

    private static void print(final List<Event> events) throws InvalidMarkValueException {
        for (Event event : events) {
            System.out.println(event + " - " + event.isPassed());
        }
    }
}
