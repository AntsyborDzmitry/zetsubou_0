package com.zetsubou_0.vadimtorus.mark;

import com.zetsubou_0.vadimtorus.mark.exception.InvalidMarkValueException;

public interface Mark {
    double getValue() throws InvalidMarkValueException;
}
