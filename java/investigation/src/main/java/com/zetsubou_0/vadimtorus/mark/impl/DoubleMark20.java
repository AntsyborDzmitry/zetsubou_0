package com.zetsubou_0.vadimtorus.mark.impl;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;

public class DoubleMark20 extends AbstractDoubleMark {

    public DoubleMark20(final double mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        int intValue = tenTimesMultiple();
        if (intValue < 10 || intValue > 200 || !isWholeOrHalf()) {
            throw new InvalidMarkValueException("Out of bounds or not half value");
        }
    }
}
