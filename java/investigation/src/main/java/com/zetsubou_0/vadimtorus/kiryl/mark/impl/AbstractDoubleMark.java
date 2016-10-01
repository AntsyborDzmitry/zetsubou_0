package com.zetsubou_0.vadimtorus.kiryl.mark.impl;

import com.zetsubou_0.vadimtorus.kiryl.mark.Mark;
import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public abstract class AbstractDoubleMark<T extends Double> implements Mark<T> {

    protected final T mark;

    public AbstractDoubleMark(final T mark) {
        this.mark = mark;
    }

    @Override
    public T getValue() throws InvalidMarkValueException {
        isValid();
        return mark;
    }

    abstract void isValid() throws InvalidMarkValueException;

    boolean isWholeOrHalf() {
        return tenTimesMultiple() % 5 == 0;
    }

    private int tenTimesMultiple() {
        return (int) Math.round(mark.doubleValue() * 10);
    }
}
