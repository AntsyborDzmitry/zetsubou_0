<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<slice:lookup var="model" type="<%=com.dhl.components.model.SelectLocationModel.class%>" />

<c:if test="${not empty model.defaultLocation}">
    <c:redirect url="${model.defaultLocation}"/>
</c:if>

<ewf:registerComponent elements="ewf-location-selector"
        paths="components/location-selector/location-selector-directive"/>

<ewf-location-selector></ewf-location-selector>