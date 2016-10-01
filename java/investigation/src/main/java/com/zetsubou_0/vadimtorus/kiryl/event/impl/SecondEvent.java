package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class SecondEvent extends AbstractTwoExamEvent {

    public SecondEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark) {
        super(firstExamMark, secondExamMark);
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstParamExamMark.getValue() >= Constants.Exam.PASSED_MARK
                && secondParamExamMark.getValue() >= Constants.Exam.PASSED_MARK;
    }

}
