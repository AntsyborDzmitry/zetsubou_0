<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="ewf-password,
            ewf-form,
            ewf-field,
            form,
            ewf-registration,
            ewf-password,
            registration-form,
            registration-result,
            email-verification"
        paths="components/register/registration-directive"
        modules="visualCaptcha"
        />

<ewf-registration></ewf-registration>