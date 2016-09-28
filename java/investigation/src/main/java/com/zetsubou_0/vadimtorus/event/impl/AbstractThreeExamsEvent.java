package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;

public abstract class AbstractThreeExamsEvent implements Event {

    Mark firstExamMark;

    Mark secondExamMark;

    Mark thirdExamMark;

    public AbstractThreeExamsEvent(final Mark firstExamMark, final Mark secondExamMark, final Mark thirdExamMark) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
        this.thirdExamMark = thirdExamMark;
    }
}
