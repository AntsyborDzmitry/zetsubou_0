<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="ewf-shipment-complete"
        paths="components/shipment/shipment-complete/shipment-complete-directive,
            directives/ewf-form/ewf-form-directive" />

<ewf-shipment-complete></ewf-shipment-complete>