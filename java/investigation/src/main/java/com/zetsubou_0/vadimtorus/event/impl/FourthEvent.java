package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.DoubleMark20;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark10;

public class FourthEvent extends AbstractThreeExamsEvent {

    public FourthEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark,
                       final DoubleMark20 thirdExamMark) {
        super(firstExamMark, secondExamMark, thirdExamMark);
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() >= PASSED_MARK
                && secondExamMark.getValue() >= PASSED_MARK
                && thirdExamMark.getValue() >= PASSED_MARK;
    }
}
