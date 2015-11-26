package com.dhl.services.exception;

public class DocumentException extends Exception {

    /**
     * Constructs a new DocumentException
     */
    public DocumentException() {
        super();
    }

    /**
     * Constructs a new DocumentException
     * @param message detail message
     */
    public DocumentException(final String message) {
        super(message);
    }

    /**
     * Constructs a new DocumentException
     * @param message detail message
     * @param cause the cause
     */
    public DocumentException(final String message, final Throwable cause) {
        super(message, cause);
    }

    /**
     * Constructs a new DocumentException
     * @param cause the cause
     */
    public DocumentException(final Throwable cause) {
        super(cause);
    }

    /**
     * Constructs a new DocumentException
     * @param message detail message
     * @param cause the cause
     * @param enableSuppression whether or not suppression is enabled or disabled
     * @param writableStackTrace whether or not the stack trace should be writable
     */
    public DocumentException(final String message, final Throwable cause, final boolean enableSuppression,
                             final boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
