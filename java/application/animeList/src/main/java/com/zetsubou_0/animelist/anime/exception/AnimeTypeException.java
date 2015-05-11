package com.zetsubou_0.animelist.anime.exception;

/**
 * Created by zetsubou_0 on 23.04.15.
 */
public class AnimeTypeException extends Exception {
    public AnimeTypeException() {
    }

    public AnimeTypeException(String message) {
        super(message);
    }

    public AnimeTypeException(String message, Throwable cause) {
        super(message, cause);
    }

    public AnimeTypeException(Throwable cause) {
        super(cause);
    }

    public AnimeTypeException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
