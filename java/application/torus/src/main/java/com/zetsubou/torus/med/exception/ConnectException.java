package com.zetsubou.torus.med.exception;

/**
 * Created by zetsubou_0 on 29.12.15.
 */
public class ConnectException extends Exception {
    public ConnectException() {
    }

    public ConnectException(String message) {
        super(message);
    }

    public ConnectException(String message, Throwable cause) {
        super(message, cause);
    }

    public ConnectException(Throwable cause) {
        super(cause);
    }

    public ConnectException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
