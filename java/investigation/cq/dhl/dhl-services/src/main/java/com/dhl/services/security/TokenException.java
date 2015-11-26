package com.dhl.services.security;

/**
 * if token validation failed: token is broken, timestamp expired or user was removed from DB
 */
public class TokenException extends Exception {
    private static final long serialVersionUID = 2201794540719262701L;

    TokenException(String message) {
        super(message);
    }
}