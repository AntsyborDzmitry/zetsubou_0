package com.zetsubou_0.vadimtorus.kiryl.util;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

import java.util.Comparator;

public class Constants {

    public static final int PASSED_SUM = 9;

    public static final double PASSED_SUM_THREE_EXAMS = 20.5;

    public static final int PASSED_MARK = 4;

    public static final int PASSED_MARK_BOUNDS_100 = 45;

    public static final double FILTER_BOUNDS = 15;

    public static final String RECORD_DATA_SEPARATOR = ";";

    public static final String TYPE = "%s:";

    public static final String PARAMETER = " %s";

    public static final Comparator<Event> EVENT_COMPARATOR = (event1, event2)
            -> event2.getMaxMark().compareTo(event1.getMaxMark());

}
