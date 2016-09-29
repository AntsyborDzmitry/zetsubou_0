package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public class DoubleMark10 extends AbstractDoubleMark {

    public DoubleMark10(final double mark) {
        super(mark);
    }

    @Override
    public void isValid() throws InvalidMarkValueException {
        int intValue = tenTimesMultiple();
        if (intValue < 10 || intValue > 100 || !isWholeOrHalf()) {
            throw new InvalidMarkValueException("Out of bounds or not half value");
        }
    }
}
