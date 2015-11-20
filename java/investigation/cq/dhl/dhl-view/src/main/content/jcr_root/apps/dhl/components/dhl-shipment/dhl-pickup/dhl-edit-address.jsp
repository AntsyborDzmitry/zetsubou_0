<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-address"
        paths="directives/ewf-address/ewf-address-cq-directive" />

<h3 class="h3"><fmt:message key="pickup_pickup_location"/></h3>

<div ng-if="!pickupCtrl.pickupAddressEditMode">
    <div ng-bind="pickupCtrl.pickupAddress.name"></div>
    <div ng-bind="pickupCtrl.pickupAddress.company"></div>
    <div ng-bind="pickupCtrl.pickupAddress.addressDetails.countryName"></div>
    <div ng-bind="pickupCtrl.pickupAddress.addressDetails.addrLine1"></div>
    <div>
        <span ng-bind=pickupCtrl.pickupAddress.addressDetails.city></span>,
        <span ng-bind=pickupCtrl.pickupAddress.addressDetails.stateOrProvince></span>,
        <span ng-bind=pickupCtrl.pickupAddress.addressDetails.zipOrPostCode></span>
    </div>
</div>
<ewf-address address="pickupCtrl.pickupAddressNew"
   ng-if="pickupCtrl.pickupAddressEditMode">
    <ng-form novalidate name="pickupCtrl.pickupAddressForm" ewf-form="addressDefinition">
        <div class="field-wrapper" ewf-field="name" ewf-search="{searchType: 'ordered', fieldName: 'name'}">
            <label for="pickupAddress_name" class="label"><fmt:message key="address__name_label"/></label>
            <input id="pickupAddress_name" type="text" class="input input_width_full"
               ng-model="addressCtrl.attributes.address.name"
               ewf-input="address.name"
               ewf-validate-required />
            <span class="validation-mark"></span>
            <div ewf-field-errors></div>
        </div>
        <div class="field-wrapper" ewf-field="company">
            <label for="pickupAddress_company" class="label"><fmt:message key="address__company_label"/></label>
            <input id="pickupAddress_company" type="text" class="input input_width_full"
               ng-model="addressCtrl.attributes.address.company"
               ewf-input="address.company"
               ewf-validate-required />
            <span class="validation-mark"></span>
            <div ewf-field-errors></div>
        </div>
        <div class="field-wrapper" ewf-field="address">
            <label for="pickupAddress_address" class="label"><fmt:message key="address__address_label"/></label>
            <input type="text" class="input input_width_full" name="address" id="pickupAddress_address"
               ng-model="addressCtrl.attributes.address.addressDetails.addrLine1"
               typeahead="address as address.name for address in addressCtrl.getAddresses($viewValue)"
               typeahead-template-url="address-item.html"
               typeahead-min-length="2"
               typeahead-on-select="addressCtrl.addressSelected($item, $model, $label)"
               ewf-input="address.address"
               ewf-validate-required>
            <span class="validation-mark"></span>
            <div ewf-field-errors></div>
        </div>
        <div class="field-wrapper" ewf-field="country">
            <label for="address_country" class="label"><fmt:message key="address__country_label"/></label>
            <input id="address_country" class="input input_width_full" type="text" disabled
               ng-model="addressCtrl.attributes.address.addressDetails.countryName">
        </div>
        <div class="row">
            <div class="field-wrapper col-3">
                <div ng-if="!ewfFormCtrl.hideRules.zip"
                   ewf-field="zip">
                    <label for="pickupAddress_zip" class="label"><fmt:message key="address__zip_code_label"/></label>
                    <input type="text" class="input input_width_full" id="pickupAddress_zip"
                       ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                       ewf-input="address.zip"
                       typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                       typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                       typeahead-template-url="zipTypeaheadTemplate.html"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
                <div ng-if="!ewfFormCtrl.hideRules.code"
                   ewf-field="code">
                    <label for="pickupAddress_postal" class="label"><fmt:message key="address__postal_code_label"/></label>
                    <input type="text" class="input input_width_full" id="pickupAddress_postal"
                       ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                       ewf-input="address.code"
                       typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                       typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                       typeahead-template-url="zipTypeaheadTemplate.html"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
            <div class="field-wrapper col-5" ewf-field="city" ng-if="!ewfFormCtrl.hideRules.city">
                <label for="pickupAddress_city" class="label"><fmt:message key="address__city_label"/></label>
                <input type="text" class="input input_width_full" id="pickupAddress_city"
                   ng-model="addressCtrl.attributes.address.addressDetails.city"
                   ewf-validate-required
                   ewf-input="address.city"
                   typeahead="city as city.city for city in addressCtrl.getCities($viewValue)"
                   typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                   typeahead-template-url="cityTypeaheadTemplate.html">
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>
            <div class="field-wrapper col-4">
                <div ewf-field="state" ng-if="!ewfFormCtrl.hideRules.state">
                    <label for="pickupAddress_state" class="label"><fmt:message key="address__state_label"/></label>
                    <input type="text" class="input input_width_full" id="pickupAddress_state"
                       ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                       ewf-input="address.state"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
                <div class="field-wrapper" ewf-field="province" ng-if="!ewfFormCtrl.hideRules.province">
                    <label for="pickupAddress_province" class="label"><fmt:message key="address__province_label"/></label>
                    <input type="text" class="input input_width_full" id="pickupAddress_province"
                       ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                       ewf-input="address.province"
                       ewf-validate-required>
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
        </div>
    </ng-form>
</ewf-address>
<br>
<button class="btn btn_action"
   ng-if="!pickupCtrl.pickupAddressEditMode"
   ng-click="pickupCtrl.editPickupAddress()">
    <fmt:message key="pickup_edit_pickup"/>
</button>
<button class="btn btn_action"
   ng-if="pickupCtrl.pickupAddressEditMode"
   ng-click="pickupCtrl.updatePickupAddress()">
    <fmt:message key="pickup_update_pickup"/>
</button>