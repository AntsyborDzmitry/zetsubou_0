package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;

public abstract class AbstractThreeExamsEvent implements Event {

    Double firstParamExamMark;

    Double secondParamExamMark;

    Double thirdParamExamMark;

    public AbstractThreeExamsEvent(final double firstParamExamMark, final double secondParamExamMark,
                                   final double thirdParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
        this.secondParamExamMark = secondParamExamMark;
        this.thirdParamExamMark = thirdParamExamMark;
    }

    @Override
    public Double getMaxMark() {
        return Math.max(firstParamExamMark, Math.max(secondParamExamMark, thirdParamExamMark));
    }
}
