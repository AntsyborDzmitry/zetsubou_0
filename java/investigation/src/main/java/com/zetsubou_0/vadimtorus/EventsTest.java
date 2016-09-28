package com.zetsubou_0.vadimtorus;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.event.impl.FirstEvent;
import com.zetsubou_0.vadimtorus.event.impl.ThirdEvent;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.DoubleMark10;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark10;

import java.util.LinkedList;
import java.util.List;

public class EventsTest {
    public static void main(String[] args) {
        try {
            List<Event> events = createList();
            print(events);
        } catch (InvalidMarkValueException e) {
            e.printStackTrace();
        }

    }

    private static void print(final List<Event> events) throws InvalidMarkValueException {
        for (Event event : events) {
            System.out.println(event + " - " + event.isPassed());
        }
    }

    private static List<Event> createList() throws InvalidMarkValueException {
        List<Event> events = new LinkedList<>();
        events.add(new FirstEvent(new IntegerMark10(10), new IntegerMark10(10)));
        events.add(new FirstEvent(new IntegerMark10(2), new IntegerMark10(3)));
        events.add(new FirstEvent(new IntegerMark10(10), new IntegerMark10(1)));
        events.add(new ThirdEvent(new DoubleMark10(8.5), new DoubleMark10(5), true));
        return events;
    }
}
