package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public abstract class AbstractDoubleMark implements Mark {

    protected final double mark;

    public AbstractDoubleMark(final double mark) {
        this.mark = mark;
    }

    @Override
    public double getValue() throws InvalidMarkValueException {
        isValid();
        return mark;
    }

    protected abstract void isValid() throws InvalidMarkValueException;

    protected boolean isWholeOrHalf() {
        return tenTimesMultiple() % 5 == 0;
    }

    protected int tenTimesMultiple() {
        return (int) Math.round(mark * 10);
    }
}
