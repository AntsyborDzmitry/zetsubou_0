package com.dhl.components.controller;

import com.cognifide.slice.mapper.annotation.SliceResource;

import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;

import javax.servlet.http.Cookie;

/**
 * LoginController helps get message attribute from the cookies on login component then delete it from the cookies.
 *
 */
@SliceResource
public class LoginController {

    public static final String LOGIN_MSG_CODE_COOKIE = "loginMsgCode";
    private SlingHttpServletRequest request;
    private SlingHttpServletResponse response;

    @Inject
    public LoginController(final SlingHttpServletRequest request, final SlingHttpServletResponse response) {
        this.request = request;
        this.response = response;
    }

    public String getMsgAttribute() {
        String msg = getLoginMsg();
        if (msg != null) {
            Cookie deletedCookie = new Cookie(LOGIN_MSG_CODE_COOKIE, "");
            deletedCookie.setMaxAge(0);
            deletedCookie.setPath("/");
            response.addCookie(deletedCookie);
        }
        return msg != null ? " login-title=\"" + msg + "\"" : "";
    }

    private String getLoginMsg() {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (LOGIN_MSG_CODE_COOKIE.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

}
