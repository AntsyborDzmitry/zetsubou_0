package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.mark.Mark;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark100;

public class FifthEvent extends AbstractOneExamEvent {

    private boolean firstTest;

    private boolean secondTest;

    private Mark thirdExamMark;

    public FifthEvent(final boolean firstTest, final boolean secondTest, final IntegerMark100 thirdExamMark) {
        super(thirdExamMark);
        this.firstTest = firstTest;
        this.secondTest = secondTest;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstTest && secondTest && thirdExamMark.getValue() >= PASSED_MARK_BOUNDS_100;
    }
}
