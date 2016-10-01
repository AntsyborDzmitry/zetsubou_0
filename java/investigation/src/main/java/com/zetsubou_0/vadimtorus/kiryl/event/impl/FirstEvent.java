package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.IntegerMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class FirstEvent extends AbstractTwoExamEvent {

    public FirstEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark) {
        super(firstExamMark, secondExamMark);
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstParamExamMark.getValue() + secondParamExamMark.getValue() >= Constants.Exam.PASSED_SUM;
    }
}
