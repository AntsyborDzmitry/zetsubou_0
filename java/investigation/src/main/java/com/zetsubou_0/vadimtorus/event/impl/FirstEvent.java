package com.zetsubou_0.vadimtorus.event.impl;

import com.zetsubou_0.vadimtorus.event.Event;
import com.zetsubou_0.vadimtorus.mark.Mark;
import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;
import com.zetsubou_0.vadimtorus.mark.impl.IntegerMark10;

public class FirstEvent implements Event {

    private final Mark firstExamMark;

    private final Mark secondExamMark;

    public FirstEvent(final IntegerMark10 firstExamMark, final IntegerMark10 secondExamMark) {
        this.firstExamMark = firstExamMark;
        this.secondExamMark = secondExamMark;
    }

    @Override
    public boolean isPassed() throws InvalidMarkValueException {
        return firstExamMark.getValue() + secondExamMark.getValue() >= PASSED_SUM;
    }
}
