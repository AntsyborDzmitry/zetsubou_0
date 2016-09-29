package com.zetsubou_0.vadimtorus.kiryl.eums;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.event.impl.*;

public enum FileEventEnum {

    FIRST_EVENT("e1", FirstEvent.class),
    SECOND_EVENT("e2", SecondEvent.class),
    THIRD_EVENT("e3", ThirdEvent.class),
    FOURTH_EVENT("e4", FourthEvent.class),
    FIFTH_EVENT("e5", FifthEvent.class),
    UNKNOWN("unknown", Event.class);

    private final String name;

    private final Class<? extends Event> eventClass;

    FileEventEnum(final String name, final Class<? extends Event> eventClass) {
        this.name = name;
        this.eventClass = eventClass;
    }

    public String getName() {
        return name;
    }

    public Class<? extends Event> getEventClass() {
        return eventClass;
    }

    public static FileEventEnum fromFileRecord(final String record) {
        String type = record.substring(0, record.indexOf(";"));
        for (FileEventEnum fileEvent :FileEventEnum.values()) {
            if (fileEvent.getName().equalsIgnoreCase(type)) {
                return fileEvent;
            }
        }
        return UNKNOWN;
    }
}
