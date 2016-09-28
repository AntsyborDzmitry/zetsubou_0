package com.zetsubou_0.vadimtorus.mark.impl;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;

public class IntegerMark10 extends AbstractIntegerMark {

    public IntegerMark10(final int mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        if (mark < 1 || mark > 10) {
            throw new InvalidMarkValueException("Out of bounds");
        }
    }
}
