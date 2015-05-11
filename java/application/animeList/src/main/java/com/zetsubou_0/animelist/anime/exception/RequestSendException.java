package com.zetsubou_0.animelist.anime.exception;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public class RequestSendException extends Exception {
    public RequestSendException() {
    }

    public RequestSendException(String message) {
        super(message);
    }

    public RequestSendException(String message, Throwable cause) {
        super(message, cause);
    }

    public RequestSendException(Throwable cause) {
        super(cause);
    }

    public RequestSendException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
