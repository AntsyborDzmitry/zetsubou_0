package com.zetsubou_0.animelist.anime.exception;

/**
 * Created by zetsubou_0 on 01.05.15.
 */
public class ActionException extends Exception {
    public ActionException() {
    }

    public ActionException(String message) {
        super(message);
    }

    public ActionException(String message, Throwable cause) {
        super(message, cause);
    }

    public ActionException(Throwable cause) {
        super(cause);
    }

    public ActionException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
