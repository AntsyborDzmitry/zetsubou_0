<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="reset-password,
            ewf-password,
            ewf-form,
            ewf-input"
        paths="components/reset-password/reset-password-directive"
/>

<reset-password></reset-password>