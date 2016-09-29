package com.zetsubou_0.vadimtorus.kiryl.coverter;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

public interface EventConverter {
    String DATA_SEPARATOR = ";";

    Event convert(String record);
}
