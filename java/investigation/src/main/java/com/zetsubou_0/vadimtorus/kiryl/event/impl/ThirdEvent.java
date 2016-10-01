package com.zetsubou_0.vadimtorus.kiryl.event.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.kiryl.mark.impl.DoubleMark10;
import com.zetsubou_0.vadimtorus.kiryl.util.Constants;

public class ThirdEvent extends AbstractTwoExamEvent {

    private boolean thirdTest;

    public ThirdEvent(final DoubleMark10 firstExamMark, final DoubleMark10 secondExamMark, final boolean thirdTest) {
        super(firstExamMark, secondExamMark);
        this.thirdTest = thirdTest;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstParamExamMark.getValue() >= Constants.Exam.PASSED_MARK
                && secondParamExamMark.getValue() >= Constants.Exam.PASSED_MARK
                && thirdTest;
    }
}
