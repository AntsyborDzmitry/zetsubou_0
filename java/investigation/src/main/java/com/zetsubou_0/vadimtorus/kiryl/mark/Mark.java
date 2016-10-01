package com.zetsubou_0.vadimtorus.kiryl.mark;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public interface Mark<T extends Number> {
    T getValue() throws InvalidMarkValueException;
}
