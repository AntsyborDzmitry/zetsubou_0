package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.event.Event;
import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;

public abstract class AbstractThreeExamsEvent implements Event {

    Mark firstParamExamMark;

    Mark secondParamExamMark;

    Mark thirdParamExamMark;

    public AbstractThreeExamsEvent(final Mark firstParamExamMark, final Mark secondParamExamMark, final Mark thirdParamExamMark) {
        this.firstParamExamMark = firstParamExamMark;
        this.secondParamExamMark = secondParamExamMark;
        this.thirdParamExamMark = thirdParamExamMark;
    }
}
