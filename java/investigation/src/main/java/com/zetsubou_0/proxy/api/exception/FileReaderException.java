package com.zetsubou_0.proxy.api.exception;

/**
 * Created by Kiryl_Lutsyk on 10/29/2015.
 */
public class FileReaderException extends Exception {
    public FileReaderException() {
    }

    public FileReaderException(String message) {
        super(message);
    }

    public FileReaderException(String message, Throwable cause) {
        super(message, cause);
    }

    public FileReaderException(Throwable cause) {
        super(cause);
    }

    public FileReaderException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
