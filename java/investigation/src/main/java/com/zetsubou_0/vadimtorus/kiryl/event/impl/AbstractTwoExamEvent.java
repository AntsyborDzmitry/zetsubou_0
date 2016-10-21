package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

public abstract class AbstractTwoExamEvent implements Event {

    Double firstParamExamMark;

    Double secondParamExamMark;

    public AbstractTwoExamEvent(final double firstParamExamMark, final double secondParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
        this.secondParamExamMark = secondParamExamMark;
    }

    @Override
    public Double getMaxMark() {
        return Math.max(firstParamExamMark, secondParamExamMark);
    }
}
