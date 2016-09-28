package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.DoubleMark20;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark10;

public class FourthEvent implements Event {

    private final Mark firstExamMark;

    private final Mark secondExamMark;

    private final Mark thirdExamMark;

    public FourthEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark,
                       final DoubleMark20 thirdExamMark) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
        this.thirdExamMark = thirdExamMark;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() >= PASSED_MARK
                && secondExamMark.getValue() >= PASSED_MARK
                && thirdExamMark.getValue() >= PASSED_MARK;
    }
}
