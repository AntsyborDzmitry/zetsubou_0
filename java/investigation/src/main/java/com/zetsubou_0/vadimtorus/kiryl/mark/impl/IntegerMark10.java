package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public class IntegerMark10<T extends Integer> extends AbstractIntegerMark<T> {

    public IntegerMark10(final T mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        if (mark.intValue() < 1 || mark.intValue() > 10) {
            throw new InvalidMarkValueException("Out of bounds");
        }
    }
}
