<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<ewf:registerComponent
        elements="ewf-profile-shipment-default"
        paths="components/profile-shipment-defaults/profile-shipment-default-directive" />

<div ewf-profile-shipment-default class="container">
    <h1 class="page-title"><fmt:message key="shipment_defaults_my_shipment_settings"/></h1>
    <section class="area area_tabs">
        <div class="col-3 col-3_tabs">
            <ul class="tabs tabs_vertical tabs_vertical_full">
                <li class="tabs__title"><fmt:message key="shipment_defaults_menu"/></li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'manageShipment'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('manageShipment')"><fmt:message key="dhl_shipment_settings_my_defaults_title"/></a>
                </li>
                <li class="tabs__title"><fmt:message key="saved_settings_menu"/></li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'myDhlAccount'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('myDhlAccount')"><fmt:message key="dhl_shipment_settings_my_accounts_title"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'authorizedAccountUsage'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('authorizedAccountUsage')"><fmt:message key="dhl_shipment_settings_my_authorized_accounts_title"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'packagingSettings'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('packagingSettings')"><fmt:message key="dhl_shipment_settings_my_packagings_title"/></a>
                </li>
                <li  class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'shipmentReference'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('shipmentReference')"><fmt:message key="dhl_shipment_settings_my_sipment_reference"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'printerSettings'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('printerSettings')"><fmt:message key="printer_settings_page_title"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'notificationAndSharing'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('notificationAndSharing')"><fmt:message key="nfn_shr__menu"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'authorizedPickupLocations'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('authorizedPickupLocations')"><fmt:message key="authorized_pickup_locations_menu"/></a></a>
                </li>
                <li class="tabs__title"><fmt:message key="customs_clearance_settings_menu"/></li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'customsInvoiceTemplates'}">
                     <a ng-click="defaultShipmentController.setCurrentTab('customsInvoiceTemplates')"><fmt:message key="customs_invoice_templates_menu"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'myProductDescriptions'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('myProductDescriptions')"><fmt:message key="my_product_list_menu"/></a>
                </li>
                <li class="tabs__item" ng-class="{'is-active': defaultShipmentController.currentTab === 'paperlessCustomsEnrollment'}">
                    <a ng-click="defaultShipmentController.setCurrentTab('paperlessCustomsEnrollment')"><fmt:message key="digital_customs_invoices_menu"/></a>
                </li>
            </ul>
        </div>
        <div class="col-9 tab-content">
            <div ng-switch="defaultShipmentController.currentTab">
                <div ng-switch-when="manageShipment">
                    <cq:include path="manageshipment" resourceType="dhl/components/myprofile/dhl-manage-shipment"/>
                </div>
                <div ng-switch-when="myDhlAccount">
                    <cq:include path="mydhlaccount" resourceType="dhl/components/myprofile/dhl-my-dhl-accounts"/>
                </div>
                <div ng-switch-when="authorizedAccountUsage">
                    <cq:include path="authorizedaccountusage" resourceType="dhl/components/myprofile/dhl-authorized-account-usage"/>
                </div>
                <div ng-switch-when="packagingSettings">
                    <cq:include path="packagingSettings" resourceType="dhl/components/myprofile/dhl-packaging-settings"/>
                </div>
                <div ng-switch-when="printerSettings">
                    <cq:include path="printersettings" resourceType="dhl/components/myprofile/dhl-printer-settings"/>
                </div>
                <div ng-switch-when="shipmentReference">
                    <cq:include path="shipmentreference" resourceType="dhl/components/myprofile/dhl-shipment-reference"/>
                </div>
                <div ng-switch-when="notificationAndSharing">
                    <cq:include path="notificationsharing" resourceType="dhl/components/myprofile/dhl-notification-sharing"/>
                </div>
                <div ng-switch-when="authorizedPickupLocations">
                    <span>Not Implemented Yet</span>
                </div>
                <div ng-switch-when="customsInvoiceTemplates">
                    <cq:include path="notificationsharing" resourceType="dhl/components/myprofile/dhl-customs-invoice-template"/>
                </div>
                <div ng-switch-when="myProductDescriptions">
                    <cq:include path="myproductlist" resourceType="dhl/components/myprofile/dhl-my-product-list"/>
                </div>
                <div ng-switch-when="paperlessCustomsEnrollment">
                    <cq:include path="digitalcustomsinvoice" resourceType="dhl/components/myprofile/dhl-digital-customs-invoices"/>
                </div>
            </div>
        </div>
    </section>
</div>