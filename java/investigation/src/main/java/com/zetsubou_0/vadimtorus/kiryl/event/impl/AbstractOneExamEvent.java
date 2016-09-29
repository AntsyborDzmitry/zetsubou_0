package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

public abstract class AbstractOneExamEvent implements Event {

    Mark firstExamMark;

    public AbstractOneExamEvent(final Mark firstExamMark) {
        this.firstExamMark = firstExamMark;
    }
}
