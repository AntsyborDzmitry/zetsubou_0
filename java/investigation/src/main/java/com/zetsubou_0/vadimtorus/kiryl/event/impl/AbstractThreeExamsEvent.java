package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

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
