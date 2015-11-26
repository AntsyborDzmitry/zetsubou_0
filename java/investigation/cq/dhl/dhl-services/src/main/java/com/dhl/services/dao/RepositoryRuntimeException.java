package com.dhl.services.dao;
        
import javax.jcr.RepositoryException;

public class RepositoryRuntimeException extends RuntimeException {
private static final long serialVersionUID = 7887766462868945183L;

    public RepositoryRuntimeException(String message, RepositoryException cause) {
        super(message, cause);
    }
}
