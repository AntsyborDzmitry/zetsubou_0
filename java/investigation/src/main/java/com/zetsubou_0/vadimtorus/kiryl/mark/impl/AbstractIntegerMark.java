package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public abstract class AbstractIntegerMark<T extends Integer> implements Mark<T> {

    protected final T mark;

    public AbstractIntegerMark(final T mark) {
        this.mark = mark;
    }

    @Override
    public T getValue() throws InvalidMarkValueException {
        isValid();
        return mark;
    }

    protected abstract void isValid() throws InvalidMarkValueException;
}
