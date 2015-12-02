package com.zetsubou_0.testdemo.exception;

/**
 * Created by Kiryl_Lutsyk on 12/2/2015.
 */
public class PersonNotFoundException extends Exception {
    public PersonNotFoundException() {
    }

    public PersonNotFoundException(final String message) {
        super(message);
    }

    public PersonNotFoundException(final String message, final Throwable cause) {
        super(message, cause);
    }

    public PersonNotFoundException(final Throwable cause) {
        super(cause);
    }

    public PersonNotFoundException(final String message, final Throwable cause, final boolean enableSuppression, final boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
