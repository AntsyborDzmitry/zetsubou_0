package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;

public abstract class AbstractTwoExamEvent implements Event {

    Mark firstExamMark;

    Mark secondExamMark;

    public AbstractTwoExamEvent(final Mark firstExamMark, final Mark secondExamMark) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
    }
}
