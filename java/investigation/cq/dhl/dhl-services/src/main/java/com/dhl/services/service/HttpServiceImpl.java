package com.dhl.services.service;

import com.dhl.services.security.SecurityValidatorImpl;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.IOException;

@Component
@Service(HttpService.class)
public class HttpServiceImpl implements HttpService {
    static final String URL_FORMAT = "/content/dhl/{country}/{language}/";

    private String buildUrl(HttpServletRequest request, String newUrl) {
        int langPosition = request.getRequestURI().indexOf(CONTENT_PATH) + CONTENT_PATH.length();
        String countrySlashLang = request.getRequestURI().substring(langPosition);
        String[] pathArray = countrySlashLang.split("/");

        String currentCountryId = pathArray[0];
        String currentLangId = pathArray[1];
        return URL_FORMAT.replace("{country}", currentCountryId).replace("{language}", currentLangId) + newUrl;
    }

    @Override
    public void redirectToLogin(HttpServletRequest request,
                                HttpServletResponse response, String msgCode) throws IOException {
        if (msgCode != null) {
            Cookie cookie = new Cookie("loginMsgCode", msgCode);
            cookie.setPath("/");
            response.addCookie(cookie);
        }
        String loginUrl = buildUrl(request, "auth/login.html");

        response.sendRedirect(loginUrl);
    }

    @Override
    public void removeSecurityTokenFromCookie(HttpServletResponse httpResponse) {
        Cookie cookie = new Cookie(SecurityValidatorImpl.ECOM_SECURE_TOKEN, ""/*value*/);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setComment("EXPIRING COOKIE at " + System.currentTimeMillis());
        httpResponse.addCookie(cookie);
    }

    @Override
    public void forwardOnForbidden(HttpServletRequest request, HttpServletResponse response) {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        // TODO: forward on forbidden page
    }

    @Override
    public void forwardOnErrorPage(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException { // NOSONAR
        String errorUrl = buildUrl(request, "error.html");
        RequestDispatcher dispatcher = request.getRequestDispatcher(errorUrl);
        dispatcher.forward(request, response);
    }
}