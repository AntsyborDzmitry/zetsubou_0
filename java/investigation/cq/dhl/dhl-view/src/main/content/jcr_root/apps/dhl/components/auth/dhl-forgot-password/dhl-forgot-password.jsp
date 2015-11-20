<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="forgot-password"
        paths="components/forgot-password/forgot-password-directive"
        modules="visualCaptcha" />

<forgot-password></forgot-password>