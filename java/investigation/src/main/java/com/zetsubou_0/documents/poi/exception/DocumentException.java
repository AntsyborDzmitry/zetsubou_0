package com.zetsubou_0.documents.poi.exception;

/**
 * Created by Kiryl_Lutsyk on 11/18/2015.
 */
public class DocumentException extends Exception {
    public DocumentException() {
    }

    public DocumentException(String message) {
        super(message);
    }

    public DocumentException(String message, Throwable cause) {
        super(message, cause);
    }

    public DocumentException(Throwable cause) {
        super(cause);
    }

    public DocumentException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
