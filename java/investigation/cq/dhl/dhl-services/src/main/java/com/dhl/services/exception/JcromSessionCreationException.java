package com.dhl.services.exception;

public class JcromSessionCreationException extends RuntimeException{

    private static final long serialVersionUID = -4606103898743841380L;

    public JcromSessionCreationException() {
        super();
    }

    public JcromSessionCreationException(String message, Throwable cause) {
        super(message, cause);
    }

    public JcromSessionCreationException(String message) {
        super(message);
    }

    public JcromSessionCreationException(Throwable cause) {
        super(cause);
    }

}
