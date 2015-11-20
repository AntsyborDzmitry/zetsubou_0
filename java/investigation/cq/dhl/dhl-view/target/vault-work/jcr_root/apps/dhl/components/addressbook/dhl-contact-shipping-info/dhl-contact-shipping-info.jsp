<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<slice:lookup var="componentProperties" appName="dhlApp" type="<%=com.dhl.components.model.ComponentProperties.class%>" />

<ewf:registerComponent
        elements="contact-shipping-info"
        paths="components/address-book/contact-info/contact-shipping-info/contact-shipping-info-directive,
            directives/ewf-input/ewf-input-controller,
            directives/ewf-validate/ewf-validate-required-directive"/>

<contact-shipping-info shipping="${componentProperties.parentControllerObject}">
    <ng-form name="contactShippingInfoForm">
        <div ewf-form="contactShippingInfo" class="overlay-white">
            <div class="nav right">
                <a class="nav__item btn btn_action" ng-click="contactShippingInfoCtrl.toggleLayout()"
                   ng-hide="contactShippingInfoCtrl.isEditing">
                    <i class="dhlicon-pencil"></i><fmt:message key="contact_info_shipping_edit_button"/>
                </a>
                <a class="nav__item btn btn_action" ng-click="contactShippingInfoCtrl.toggleLayout()"
                   ng-show="contactShippingInfoCtrl.isEditing">
                    <i class="dhlicon-pencil"></i>
                    <fmt:message key="contact_info_shipping_close_link"/>
                </a>
            </div>
            <h3 class="margin-none"><fmt:message key="contact_info_shipping_title"/></h3>
            <div class="row" ng-show="contactShippingInfoCtrl.isEditing">
                <label class="label"><fmt:message key="contact_info_shipping_declared_value_currency_label"/></label>
                <span class="select">
                    <select name="currency"
                       ng-model="contactShippingInfoCtrl.attributes.shipping.currency"
                       ng-options="currency for currency in contactShippingInfoCtrl.currenciesMock">
                    </select>
                </span>
                <div class="row fw-bold margin-top">
                    <fmt:message key="contact_info_shipping_add_your_own_references_label"/>
                </div>

                <div class="row margin-top-small">
                    <label class="label"><fmt:message key="contact_info_shipping_reference_label"/></label>
                </div>
                <div ng-repeat="reference in contactShippingInfoCtrl.attributes.shipping.referencesForShipments">
                    <div class="row field-wrapper"
                       ng-if="reference.referenceType === 'DEFAULT'"
                       ng-class="{'margin-top-small': $index !== 0}"
                       ewf-field="{{'reference_' + $index}}">
                        <input class="input input_width_huge" name="referenceLabelWaybill" type="text"
                           placeholder="<fmt:message key="contact_info_shipping_default_placeholder_label"/>"
                           ng-model="reference.referenceName"
                           ewf-input="{{'contactShippingInfo.reference_' + $index}}">
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>
                </div>

                <div class="row margin-top-small">
                    <div class="field-wrapper"
                       ng-repeat="reference in contactShippingInfoCtrl.attributes.shipping.referencesForShipments">
                        <div ng-if="reference.referenceType === 'OPTIONAL'" ewf-field="{{'reference_' + $index}}">
                            <label class="label" ng-if="$index === 1"><fmt:message key="contact_info_shipping_additional_reference_label"/></label>
                            <input class="input input_width_huge" name="reference" type="text"
                               placeholder="<fmt:message key="contact_info_shipping_optional_placeholder_label"/>"
                               ng-model="reference.referenceName"
                               ewf-input="{{'contactShippingInfo.reference_' + $index}}"
                               ewf-validate-required>
                            <div ewf-field-errors></div>
                            <a class="btn btn_action" ng-click="contactShippingInfoCtrl.removeReference(reference)">
                                <i class="dhlicon-cancel"></i>
                                <fmt:message key="contact_info_shipping_remove_button"/>
                            </a>
                        </div>
                    </div>
                    <a class="btn btn_animate btn_small" ng-disabled="!contactShippingInfoForm.$valid"
                       ng-click="contactShippingInfoForm.$valid && contactShippingInfoCtrl.addAnotherReference()">
                        <i class="dhlicon-add"></i>
                        <span class="btn__text"><fmt:message key="contact_info_shipping_add_button"/></span>
                    </a>
                </div>
            </div>
        </div>
    </ng-form>
</contact-shipping-info>