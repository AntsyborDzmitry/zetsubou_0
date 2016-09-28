package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.DoubleMark10;

public class ThirdEvent implements Event {

    private final Mark firstExamMark;

    private final Mark secondExamMark;

    private final boolean thirdTest;

    public ThirdEvent(final DoubleMark10 firstExamMark, final DoubleMark10 secondExamMark, final boolean thirdTest) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
        this.thirdTest = thirdTest;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() >= PASSED_MARK
                && secondExamMark.getValue() >= PASSED_MARK
                && thirdTest;
    }
}
