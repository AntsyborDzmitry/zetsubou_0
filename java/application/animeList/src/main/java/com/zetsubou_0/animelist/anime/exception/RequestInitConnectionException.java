package com.zetsubou_0.animelist.anime.exception;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class RequestInitConnectionException extends Exception {

    public RequestInitConnectionException() {
    }

    public RequestInitConnectionException(String message) {
        super(message);
    }

    public RequestInitConnectionException(String message, Throwable cause) {
        super(message, cause);
    }

    public RequestInitConnectionException(Throwable cause) {
        super(cause);
    }

    public RequestInitConnectionException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
