package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public class DoubleMark20 extends AbstractDoubleMark {

    public DoubleMark20(final double mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        if (mark.compareTo(1.0) < 0 || mark.compareTo(20.0) > 0 || !isWholeOrHalf()) {
            throw new InvalidMarkValueException("Out of bounds or not half value");
        }
    }
}
