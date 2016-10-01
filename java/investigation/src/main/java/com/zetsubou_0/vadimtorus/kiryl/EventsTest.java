package com.zetsubou_0.vadimtorus.kiryl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;
import com.zetsubou_0.vadimtorus.kiryl.util.EventFileReader;
import com.zetsubou_0.vadimtorus.kiryl.util.Writer;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

public class EventsTest {

    public static void main(String[] args) throws IOException {
        List<Event> events = EventFileReader.readPassedRecords(args[0]);
        Writer writer = new Writer(System.out);
        writer.printEvents("Collection from file", events);
        events.sort(Constants.EVENT_COMPARATOR);
        writer.printEvents("Sorted collection", events);
        Event min = events.stream()
                .filter(event -> event.getMaxMark() > Constants.FILTER_BOUNDS)
                .min(Collections.reverseOrder(Constants.EVENT_COMPARATOR))
                .orElse(null);
        writer.printEvent("Event with minimum mark from maximum marks", min,
                "Event with minimum mark from maximum marks not found");
    }
}
