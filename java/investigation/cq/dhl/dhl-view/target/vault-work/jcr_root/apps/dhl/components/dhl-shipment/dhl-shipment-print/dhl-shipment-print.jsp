<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="ewf-shipment-print"
        paths="components/shipment/shipment-print/shipment-print-directive" />

<ewf-shipment-print></ewf-shipment-print>