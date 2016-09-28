package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;

public abstract class AbstractOneExamEvent implements Event {

    Mark firstExamMark;

    public AbstractOneExamEvent(final Mark firstExamMark) {
        this.firstExamMark = firstExamMark;
    }
}
