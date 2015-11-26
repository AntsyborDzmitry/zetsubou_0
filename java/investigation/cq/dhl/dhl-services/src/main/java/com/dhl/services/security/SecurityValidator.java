package com.dhl.services.security;

import java.util.Set;

public interface SecurityValidator {
    /**
     * Validate token and return user groups
     *
     * @param token encrypted user session
     * @return Set<String> user groups if token valid. At least should return ["regular"]
     *
     * @throws TokenException
     * @throws ServiceUnavailableException
     * @throws RuntimeException if something with Play
     */
    Set<String> getUserGroupsByToken(String token) throws TokenException;
}