package com.zetsubou_0.vadimtorus.util;

import com.zetsubou_0.vadimtorus.eums.FileEventEnum;
import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class EvetFileReader {

    private static final Function<String, Event> EVENT_CONVERTER = str -> {
        FileEventEnum fileEventEnum = FileEventEnum.fromFileRecord(str);
        return event;
    };

    private static final Predicate<Event> EVENT_FILTER = event -> {
        try {
            return event.isPassed();
        } catch (InvalidMarkValueException e) {
            throw new RuntimeException("Invalid mark.", e);
        }
    };

    public static List<Event> readData(final String fileName) throws IOException {
        try (Stream<String> stream = Files.lines(Paths.get(fileName))) {
            return stream.map(EVENT_CONVERTER)
                    .filter(EVENT_FILTER)
                    .collect(Collectors.toList());
        }
    }
}
