package com.zetsubou_0.osgi.api.exception;

/**
 * Created by Kiryl_Lutsyk on 9/2/2015.
 */
public class CommandExxeption extends Exception {
    public CommandExxeption() {
    }

    public CommandExxeption(String message) {
        super(message);
    }

    public CommandExxeption(String message, Throwable cause) {
        super(message, cause);
    }

    public CommandExxeption(Throwable cause) {
        super(cause);
    }

    public CommandExxeption(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
