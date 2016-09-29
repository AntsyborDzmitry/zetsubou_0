package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

public abstract class AbstractTwoExamEvent implements Event {

    Mark firstExamMark;

    Mark secondExamMark;

    public AbstractTwoExamEvent(final Mark firstExamMark, final Mark secondExamMark) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
    }
}
