<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<slice:lookup var="loginController" type="<%=com.dhl.components.controller.LoginController.class%>" />

<ewf:registerComponent elements="ewf-login" paths="components/login/login-directive"/>

<ewf-login ewf-form${loginController.msgAttribute}></ewf-login>
