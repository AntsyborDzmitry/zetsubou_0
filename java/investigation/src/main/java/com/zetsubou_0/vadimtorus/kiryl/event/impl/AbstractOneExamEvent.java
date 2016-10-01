package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

public abstract class AbstractOneExamEvent implements Event {

    Mark firstParamExamMark;

    public AbstractOneExamEvent(final Mark firstParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
    }
}
