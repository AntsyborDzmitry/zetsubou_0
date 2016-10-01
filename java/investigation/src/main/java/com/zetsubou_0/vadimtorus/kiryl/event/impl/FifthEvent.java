package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark100;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FifthEvent extends AbstractOneExamEvent {

    private boolean firstTest;

    private boolean secondTest;

    public FifthEvent(final boolean firstTest, final boolean secondTest, final IntegerMark100 thirdExamMark) {
        super(thirdExamMark);
        this.firstTest = firstTest;
        this.secondTest = secondTest;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstTest && secondTest && firstParamExamMark.getValue() >= Constants.Exam.PASSED_MARK_BOUNDS_100;
    }
}
