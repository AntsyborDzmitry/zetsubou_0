<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="ewf-shipment-status"
        paths="components/shipment/shipment-status/shipment-status-directive" />

<div class="container">
    <ewf-shipment-status>
        <div class="loader">
            <div class="loader-overlay">
                <div class="la-ball-pulse"><div></div><div></div><div></div></div>
            </div>
        </div>
    </ewf-shipment-status>
</div>
