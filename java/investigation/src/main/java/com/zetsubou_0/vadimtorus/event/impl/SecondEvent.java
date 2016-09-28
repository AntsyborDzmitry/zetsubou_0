package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark10;

public class SecondEvent extends AbstractTwoExamEvent {

    public SecondEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark) {
        super(firstExamMark, secondExamMark);
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() >= PASSED_MARK && secondExamMark.getValue() >= PASSED_MARK;
    }

}
