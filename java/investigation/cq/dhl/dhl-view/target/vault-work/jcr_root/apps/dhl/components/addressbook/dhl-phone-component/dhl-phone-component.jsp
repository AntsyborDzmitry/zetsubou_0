<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<slice:lookup var="componentProperties" appName="dhlApp" type="<%=com.dhl.components.model.ComponentProperties.class%>" />

<ewf:registerComponent paths="directives/ewf-phone/ewf-phone-cq-directive" />

<ewf-phone phone="${componentProperties.parentControllerObject}" form="${componentProperties.ewfPhoneFormName}" pre-id="phone">
    <ng-form ewf-form="addressDefinition">
        <div class="field form-row">
            <div class="row">
                <div class="col-3">
                    <label for="phoneType" class="label"><fmt:message key="phone__phone_type_label"/></label>
                    <span class="select">
                        <select name="phoneType" id="phoneType"
                           ng-model="phoneCtrl.attributes.phone.phoneDetails.phoneType">
                            <option ng-repeat="(phoneTypeKey, phoneTypeValue) in phoneCtrl.phoneTypesMap"
                               value="{{phoneTypeValue}}"
                               nls="new-contact.phone__{{phoneTypeValue | lowercase}}_option"
                               ng-selected="phoneTypeValue === phoneCtrl.attributes.phone.phoneDetails.phoneType"></option>
                        </select>
                        <span class="validation-mark"></span>
                        <div class="msg-error"></div>
                    </span>
                </div>
                <div class="col-3" ewf-field="countryCode">
                    <label for="countryCode" class="label"><fmt:message key="phone__country_code_label"/></label>

                    <div class="field field_with-mark phone-autocomplete">
                        <i class="phone-autocomplete__flag flag flag_small"></i>
                        <input id="countryCode" type="text" class="input input_width_full" name="countryCode"
                           ewf-input="phoneFieldForm.countryCode"
                           ng-model="phoneCtrl.attributes.phone.phoneDetails.phoneCountryCode"
                           placeholder="${componentProperties.countryCodePlaceholder}"
                           ewf-validate-pattern="PHONE_COUNTRY_CODE">
                        <div ewf-field-errors></div>
                    </div>
                </div>
                <div class="field field_with-mark"
                   ewf-field="phone"
                   ng-class="{'col-6': !phoneCtrl.isOfficePhone(), 'col-4': phoneCtrl.isOfficePhone()}">
                    <label for="phone" class="label">Phone</label>
                    <input type="text" class="input input_width_full" name="phone" id="phone"
                       ewf-validate-pattern="PHONE_NUMBER"
                       ng-model="phoneCtrl.attributes.phone.phoneDetails.phone"
                       placeholder="${componentProperties.numberPlaceholder}"
                       ui-mask="${componentProperties.phoneNumberMask}"
                       ui-options="{clearOnBlur : false}"
                       ewf-input="phoneFieldForm.phone"
                       ${componentProperties.phone_number_required ? ' ewf-validate-required' : ''}>
                    <div ewf-field-errors></div>
                </div>
                <div class="col-2 field field_with-mark" ewf-field="extPhone"
                     ng-if="phoneCtrl.isOfficePhone()">
                    <label for="extPhone" class="label"><fmt:message key="phone__extension_label"/></label>
                    <input type="text" id="extPhone" class="input input_width_full" name="extPhone"
                       ewf-input="phoneFieldForm.extPhone"
                       ewf-validate-pattern="{{phoneCtrl.patterns.numeric}}"
                       ng-model="phoneCtrl.attributes.phone.phoneDetails.phoneExt"
                       placeholder="${componentProperties.extPlaceholder}">
                    <span class="validation-mark"></span>
                    <div ewf-field-errors></div>
                </div>
            </div>
        </div>

        <label class="checkbox"
             ng-if="phoneCtrl.isMobilePhone()">
            <input type="checkbox" id="{{'smsPhone'+addressCtrl.preId}}" class="checkbox__input" name="smsEnablesPhone"
               ng-model="phoneCtrl.attributes.phone.phoneDetails.smsEnabled"
               data-aqa-id="{{'smsPhone'+addressCtrl.preId}}">
            <span class="label checkbox__label">
                <fmt:message key="phone__SMS_enabled_label"/>
            </span>
        </label>

        <div class="field-wrapper" ewf-field="fax"
             ng-if="${componentProperties.showFaxField}">
            <div class="col-6">
                <label for="fax" class="label"><fmt:message key="phone__fax_label"/></label>
                <input type="text" class="input input_width_full" id="fax" name="fax"
                   ng-model="phoneCtrl.attributes.phone.phoneDetails.fax">
            </div>
        </div>
    </ng-form>
</ewf-phone>

