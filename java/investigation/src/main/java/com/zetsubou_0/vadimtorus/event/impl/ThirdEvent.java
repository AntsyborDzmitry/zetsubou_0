package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.DoubleMark10;

public class ThirdEvent extends AbstractTwoExamEvent {

    private boolean thirdTest;

    public ThirdEvent(final DoubleMark10 firstExamMark, final DoubleMark10 secondExamMark, final boolean thirdTest) {
        super(firstExamMark, secondExamMark);
        this.thirdTest = thirdTest;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() >= PASSED_MARK
                && secondExamMark.getValue() >= PASSED_MARK
                && thirdTest;
    }
}
