package com.zetsubou_0.vadimtorus.kiryl.event;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public interface Event {

    int PASSED_SUM = 9;

    int PASSED_MARK = 4;

    int PASSED_MARK_BOUNDS_100 = 45;

    boolean isPassed() throws InvalidMarkValueException;
}