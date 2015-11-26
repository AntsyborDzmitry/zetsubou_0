package com.dhl.services.security;

/**
 * Thrown if token can't be verified because of problems with Play server:
 *  Play server in down
 *  connection timeout
 *  internal server error (500) or any other 5xx errors
 */
public class ServiceUnavailableException extends RuntimeException {
    private static final long serialVersionUID = 8837586151079499625L;

    public  ServiceUnavailableException(String message, Throwable e) {
        super(message, e);
    }
}