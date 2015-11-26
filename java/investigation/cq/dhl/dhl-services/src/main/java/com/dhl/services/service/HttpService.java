package com.dhl.services.service;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface HttpService {
    String CONTENT_PATH = "/content/dhl/";

    /**
     * @param request http request
     * @param response http response
     * @param msgCode message code
     * @throws IOException because of {@link HttpServletResponse#sendRedirect(String)}
     */
    void redirectToLogin(HttpServletRequest request, HttpServletResponse response, String msgCode) throws IOException;

    void removeSecurityTokenFromCookie(HttpServletResponse httpResponse);

    /**
     * There can be three cases when this method calling:
     * 1. unauthorized user trying to access protected page => need to login
     * 2. wrong token (hacker, expired or user removed from db) => need to relogin
     * 3. authorized user with valid token trying to access higher level
     * access page => need to notify him that he have not rights to access this page
     *
     * @param request HTTP request
     * @param response HTTP response
     */
    void forwardOnForbidden(HttpServletRequest request, HttpServletResponse response);

    void forwardOnErrorPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException; // NOSONAR
}