package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public class IntegerMark100<T extends Integer> extends AbstractIntegerMark<T> {

    public IntegerMark100(final T mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        if (mark.intValue() < 1 || mark.intValue() > 100) {
            throw new InvalidMarkValueException("Out of bounds");
        }
    }
}
