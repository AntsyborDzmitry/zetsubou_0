<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<slice:lookup var="wcmMode" appName="dhlApp" type="<%=com.dhl.components.model.WCMModeModel.class%>" />

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <title>${empty currentPage.title ? defaultTitle : currentPage.title}</title>

    <%-- include custom widgets for authoring dialogs only in non-publish mode --%>
    <c:if test="${wcmMode.enabled}"> 
        <%--<cq:includeClientLib js="etc.dhl.widgets"/>--%>
        <cq:include script="/libs/wcm/core/components/init/init.jsp"/>
    </c:if>

    <cq:include script="head-clientlibs.jsp"/>
</head>
