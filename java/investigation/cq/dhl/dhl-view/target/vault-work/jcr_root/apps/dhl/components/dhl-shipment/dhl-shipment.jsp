<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>

<ewf:registerComponent
        elements="ewf-shipment,
            ng-form,
            ewf-shipment-type,
            ewf-package-details,
            ewf-payment-type,
            ewf-shipment-products,
            ewf-pickup,
            ewf-optional-services,
            ewf-shipment-cost"
        paths="components/shipment/ewf-shipment-directive,
            components/shipment/shipment-toolbar/shipment-toolbar-directive,
            components/shipment/address-details/address-details-directive,
            components/shipment/shipment-type/ewf-shipment-type-directive,
            components/shipment/package-details/package-details-directive,
            components/shipment/payment-type/payment-type-directive,
            components/shipment/shipment-products/ewf-shipment-products-directive,
            components/shipment/pickup/ewf-pickup-directive,
            components/shipment/optional-services/ewf-optional-services-directive,
            components/shipment/shipment-cost/ewf-shipment-cost-directive"/>

<div class="container">

    <div ewf-shipment-toolbar></div>

    <ul class="steppable-breadcrumbs">
        <li class="steppable-breadcrumbs__item is-current ">Create Shipment</li>
        <li class="steppable-breadcrumbs__item">Pay</li>
        <li class="steppable-breadcrumbs__item">Print</li>
    </ul>

    <ewf-shipment>

        <div ng-show="shipmentCtrl.isMainFlowVisible()">
            <cq:include path="address-step" resourceType="dhl/components/dhl-shipment/dhl-address-details"/>

            <cq:include path="type-step" resourceType="dhl/components/dhl-shipment/dhl-shipment-type"/>

            <cq:include path="package-step" resourceType="dhl/components/dhl-shipment/dhl-package-details"/>

            <cq:include path="payment-step" resourceType="dhl/components/dhl-shipment/dhl-payment-type"/>

            <cq:include path="products-step" resourceType="dhl/components/dhl-shipment/dhl-shipment-products"/>

            <cq:include path="optional-services-step" resourceType="dhl/components/dhl-shipment/dhl-optional-services"/>

            <cq:include path="pickup-step" resourceType="dhl/components/dhl-shipment/dhl-pickup"/>

            <cq:include path="cost-step" resourceType="dhl/components/dhl-shipment/dhl-shipment-cost"/>
        </div>

        <div ng-if="!shipmentCtrl.isMainFlowVisible()" ng-cloak>
            <cq:include path="enhanced-invoice" resourceType="dhl/components/dhl-shipment/dhl-enhanced-invoice"/>
        </div>

    </ewf-shipment>
</div>
