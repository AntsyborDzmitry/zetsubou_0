package com.zetsubou_0.vadimtorus.kiryl.event;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public interface Event {

    boolean isPassed() throws InvalidMarkValueException;
}
