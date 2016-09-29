package com.zetsubou_0.vadimtorus.kiryl.mark;

import com.zetsubou_0.vadimtorus.kiryl.mark.exception.InvalidMarkValueException;

public interface Mark {
    double getValue() throws InvalidMarkValueException;
}
