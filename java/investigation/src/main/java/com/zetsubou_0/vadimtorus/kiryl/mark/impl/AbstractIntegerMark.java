package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public abstract class AbstractIntegerMark implements Mark {

    protected final int mark;

    public AbstractIntegerMark(final int mark) {
        this.mark = mark;
    }

    @Override
    public double getValue() throws InvalidMarkValueException {
        isValid();
        return mark;
    }

    protected abstract void isValid() throws InvalidMarkValueException;
}
