package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

public abstract class AbstractOneExamEvent implements Event {

    Double firstParamExamMark;

    public AbstractOneExamEvent(final double firstParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
    }

    @Override
    public Double getMaxMark() {
        return firstParamExamMark;
    }
}
