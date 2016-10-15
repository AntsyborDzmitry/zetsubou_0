package com.zetsubou_0.vadimtorus.kiryl.mark;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public enum Mark {
    DOUBLE10(0, 10), DOUBLE20(0, 20), INTEGER10(0, 10), INTEGER100(0, 100);

    private static final String ERR_MESSAGE_NOT_HALF = "Mark should be half or whole value";

    private static final String ERR_MESSAGE_OUT_OF_BOUNDS = "Mark out of bounds [%d;%d], value - %.2d";

    private final Double leftValue;

    private final Double rightValue;

    Mark(final double leftValue, final double rightValue) {
        this.leftValue = leftValue;
        this.rightValue = rightValue;
    }

    public double valueOf(final double value) {
        if ((this == DOUBLE10 || this == DOUBLE20) && !isWholeOrHalf(value)) {
            throw new InvalidMarkValueException(ERR_MESSAGE_NOT_HALF);
        }
        if (value < this.leftValue || value > this.rightValue) {
            throw new InvalidMarkValueException(String.format(ERR_MESSAGE_OUT_OF_BOUNDS, leftValue, rightValue, value));
        }
        return value;
    }

    private boolean isWholeOrHalf(final double value) {
        return tenTimesMultiple(value) % 5 == 0;
    }

    private long tenTimesMultiple(final double value) {
        return Math.round(value * 10);
    }

}
