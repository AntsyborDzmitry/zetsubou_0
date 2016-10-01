package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

public abstract class AbstractTwoExamEvent implements Event {

    Mark firstParamExamMark;

    Mark secondParamExamMark;

    public AbstractTwoExamEvent(final Mark firstParamExamMark, final Mark secondParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
        this.secondParamExamMark = secondParamExamMark;
    }
}
