package com.zetsubou_0.vadimtorus.kiryl.util;

import com.zetsubou_0.vadimtorus.kiryl.coverter.EventConverterEnum;
import com.zetsubou_0.vadimtorus.kiryl.event.Event;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class EventFileReader {

    private static final Function<String, Event> EVENT_CONVERTER = str -> {
        EventConverterEnum fileEventConverter = EventConverterEnum.fromFileRecord(str);
        try {
            return fileEventConverter.getEventConverterClass().newInstance().convert(str);
        } catch (InstantiationException | IllegalAccessException e) {
            throw new RuntimeException("Error occurred while converting file record to event.", e);
        }
    };

    private static final Predicate<Event> EVENT_FILTER = Event::isPassed;

    public static List<Event> readPassedRecords(final String fileName) throws IOException {
        try (Stream<String> stream = Files.lines(Paths.get(fileName))) {
            return stream.map(EVENT_CONVERTER)
                    .filter(EVENT_FILTER)
                    .collect(Collectors.toList());
        }
    }
}
