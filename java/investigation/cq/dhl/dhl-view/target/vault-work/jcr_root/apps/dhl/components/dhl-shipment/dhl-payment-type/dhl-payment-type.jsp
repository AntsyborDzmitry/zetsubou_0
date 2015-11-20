<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-payment-type"
        paths="components/shipment/payment-type/payment-type-directive,
            directives/ewf-validate/ewf-validate-attribute-directive"/>

<ewf-payment-type ewf-form="paymentType" ewf-form-options="{{ paymentTypeCtrl.formOptions }}">
<div ng-cloak ng-if="paymentTypeCtrl.initialized">
    <div class="row" ng-form="paymentTypeCtrl.paymentTypeForm">
        <div id="section_payment" class="area-wrap">
            <section class="area" ng-show="paymentTypeCtrl.editModeActive">
                <header class="area__header">
                    <span class="right"></span>
                    <h2 class="area__title h2">
                        <fmt:message key="payment_type_title"/>
                    </h2>
                </header>
                <div class="area__content">
                    <div class="row">
                        <div class="col-4">
                            <div class="field-wrapper"
                               ng-if="paymentTypeCtrl.isQuotationTypeShown()">
                                <label class="label">
                                    <fmt:message key="payment_type_shipper_account"/>
                                </label>
                                <div class="select select_width_full" ewf-field="quotationType">
                                    <select ng-model="paymentTypeCtrl.quotationType" ng-change="paymentTypeCtrl.onQuotationTypeSelectorChanged()"
                                       ng-options="option as paymentTypeCtrl.resolvePaymentTypeName(option) for option in paymentTypeCtrl.paymentAccounts.shippers track by option.accountId"
                                       name="quotationType"
                                       ewf-input="paymentType.quotationType"
                                       ewf-validate-required
                                       ewf-validate-attribute
                                       ewf-validate-attribute-valid="!paymentTypeCtrl.isErrorOnType(paymentTypeCtrl.quotationType)"
                                       ewf-validate-attribute-message="{{paymentTypeCtrl.paymentTypesErrors[paymentTypeCtrl.quotationType.title]}}">
                                        <option class="is-hidden" selected disabled value="">
                                            <fmt:message key="payment_type_select_one"/>
                                        </option>
                                    </select>
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>

                            <div class="field-wrapper" ng-if="paymentTypeCtrl.paymentAccounts.shippers.length > 1">
                                <label class="checkbox">
                                    <input type="checkbox" id="how_pay_checkbox" class="checkbox__input" name="paymentTypeShipment"
                                       ng-model="paymentTypeCtrl.checkedForTransportationCharges"
                                       ng-change="paymentTypeCtrl.howPayCheckboxChanged(paymentTypeCtrl.paymentTypeForm)"
                                       data-aqa-id="how_pay_checkbox">
                                    <span class="label">
                                        <fmt:message key="payment_type_shipper_account_used_for_transportation_charges"/>
                                    </span>
                                </label>
                            </div>

                            <div class="field-wrapper" ng-if="paymentTypeCtrl.isTransportationShown()">
                                <label class="label">
                                    <fmt:message key="payment_type_label_title"/>
                                </label>
                                <div class="select select_width_full" ewf-field="transportationPaymentType">
                                    <select ng-model="paymentTypeCtrl.transportationPaymentType" ng-change="paymentTypeCtrl.onTransportationPaymentTypeSelectorChanged()"
                                        ng-options="option as paymentTypeCtrl.resolvePaymentTypeName(option) for option in paymentTypeCtrl.paymentAccounts.others"
                                        name="transportationPaymentType"
                                        ewf-input="paymentType.transportationPaymentType"
                                        ewf-validate-required
                                        ewf-validate-attribute
                                        ewf-validate-attribute-valid="!paymentTypeCtrl.isErrorOnType(paymentTypeCtrl.transportationPaymentType)"
                                        ewf-validate-attribute-message="{{paymentTypeCtrl.paymentTypesErrors[paymentTypeCtrl.transportationPaymentType.title]}}">
                                        <option class="is-hidden" selected disabled value="">
                                            <fmt:message key="payment_type_select_one"/>
                                        </option>
                                    </select>
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>
                            <div class="note"
                               ng-if="paymentTypeCtrl.isCreditCardPayment()">
                                <fmt:message key="payment_type_credit_card_hint"/>
                            </div>

                            <div class="form-row"
                               ng-if="paymentTypeCtrl.isTransportationShown() && paymentTypeCtrl.transportationPaymentType.paymentType === paymentTypeCtrl.PAYMENT_TYPES.ALTERNATE_DHLACCOUNT">
                                <label class="label">
                                    <fmt:message key="payment_type_label_account_number"/>
                                </label>
                                <div class="field field_with-mark field_width_half"
                                   ewf-field="payAccountNumber">
                                    <input type="text" class="input" name="payAccountNumber"
                                        ng-model="paymentTypeCtrl.alternateDhlAccount.accountNumber"
                                        ng-blur="paymentTypeCtrl.validateAlternateDhlAccount(paymentTypeCtrl.alternateDhlAccount, paymentTypeCtrl.paymentTypeForm.payAccountNumber)"
                                        ng-focus="paymentTypeCtrl.onAlternateDhlAccountFocus()"
                                        ewf-input="paymentType.payAccountNumber"
                                        ewf-validate-required
                                        ewf-validate-attribute
                                        ewf-validate-attribute-valid="paymentTypeCtrl.alternateDhlAccount.valid"
                                        ewf-validate-attribute-message="{{paymentTypeCtrl.alternateDhlAccount.message}}">
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>
                        </div>

                        <div class="col-4" ng-if="paymentTypeCtrl.isDutiesAndTaxesShown() && paymentTypeCtrl.paymentAccounts.duties.length > 0">
                            <div class="field-wrapper">
                                <label class="label" nls-bind nls="{{ paymentTypeCtrl.getDutiesAndTaxesLabel() }}"></label>
                                <div class="select select_width_full" ewf-field="dutiesPaymentType">
                                    <select ng-model="paymentTypeCtrl.dutiesPaymentType" ng-change="paymentTypeCtrl.onDutiesPaymentTypeSelectorChanged()"
                                        ng-options="option as paymentTypeCtrl.resolvePaymentTypeName(option, true) for option in paymentTypeCtrl.paymentAccounts.duties"
                                        name="dutiesPaymentType"
                                        required
                                        ewf-input="paymentType.dutiesPaymentType"
                                        ewf-validate-required
                                        ewf-validate-attribute
                                        ewf-validate-attribute-valid="!paymentTypeCtrl.isErrorOnType(paymentTypeCtrl.dutiesPaymentType)"
                                        ewf-validate-attribute-message="{{paymentTypeCtrl.paymentTypesErrors[paymentTypeCtrl.dutiesPaymentType.title]}}">
                                        <option class="is-hidden" selected disabled value="">
                                            <fmt:message key="payment_type_select_one"/>
                                        </option>
                                    </select>
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>

                            <div class="field-wrapper account-number" ng-if="paymentTypeCtrl.isPaymentTypeAlternateAccountShown('duties') && paymentTypeCtrl.paymentAccounts.duties.length > 1">
                                <label class="label">
                                    <fmt:message key="payment_type_label_account_number"/>
                                </label>
                                <div class="field" ewf-field="dutiesAccountNumber">
                                    <input type="text" class="input" name="dutiesAccountNumber" ng-model="paymentTypeCtrl.dutiesAlternateDhlAccount.accountNumber"
                                        ng-blur="paymentTypeCtrl.validateAlternateDhlAccount(paymentTypeCtrl.dutiesAlternateDhlAccount, paymentTypeCtrl.paymentTypeForm.dutiesAccountNumber)"
                                        ng-focus="paymentTypeCtrl.onAlternateDhlAccountFocus()"
                                        ewf-input="paymentType.dutiesAlternateDhlAccount"
                                        ewf-validate-required
                                        ewf-validate-attribute
                                        ewf-validate-attribute-valid="paymentTypeCtrl.dutiesAlternateDhlAccount.valid"
                                        ewf-validate-attribute-message="{{paymentTypeCtrl.dutiesAlternateDhlAccount.message}}">
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>

                            <div ng-if="paymentTypeCtrl.isPaymentSplitterShown && paymentTypeCtrl.splitDutyAndTaxPayment">
                                <div class="field-wrapper">
                                    <label class="label">
                                        <fmt:message key="payment_type_taxes_title"/>
                                    </label>
                                    <div class="select select_width_full" ewf-field="taxesPaymentType">
                                        <select name="taxesPaymentType" required
                                            ng-options="option as paymentTypeCtrl.resolvePaymentTypeName(option, true) for option in paymentTypeCtrl.paymentAccounts.duties"
                                            ng-change="paymentTypeCtrl.onTaxesPaymentTypeSelectorChanged()"
                                            ng-model="paymentTypeCtrl.taxesPaymentType"
                                            ewf-input="paymentType.taxesPaymentType"
                                            ewf-validate-required
                                            ewf-validate-attribute
                                            ewf-validate-attribute-valid="!paymentTypeCtrl.isErrorOnType(paymentTypeCtrl.taxesPaymentType)"
                                            ewf-validate-attribute-message="{{paymentTypeCtrl.paymentTypesErrors[paymentTypeCtrl.taxesPaymentType.title]}}">
                                            <option class="is-hidden" selected disabled value="">
                                                <fmt:message key="payment_type_select_one"/>
                                            </option>
                                        </select>
                                        <span class="validation-mark"></span>
                                        <div ewf-field-errors></div>
                                    </div>
                                </div>
                                <div class="field-wrapper account-number" ng-if="paymentTypeCtrl.isPaymentTypeAlternateAccountShown('taxes') && paymentTypeCtrl.paymentAccounts.duties.length > 1">
                                    <label class="label">
                                        <fmt:message key="payment_type_label_account_number"/>
                                    </label>
                                    <div class="field" ewf-field="taxesAccountNumber">
                                        <input type="text" class="input" name="taxesAccountNumber"
                                            ng-model="paymentTypeCtrl.taxesAlternateDhlAccount.accountNumber"
                                            ng-blur="paymentTypeCtrl.validateAlternateDhlAccount(paymentTypeCtrl.taxesAlternateDhlAccount, paymentTypeCtrl.paymentTypeForm.taxesAccountNumber)"
                                            ng-focus="paymentTypeCtrl.onAlternateDhlAccountFocus()"
                                            ewf-input="paymentType.taxesAlternateDhlAccount"
                                            ewf-validate-required
                                            ewf-validate-attribute
                                            ewf-validate-attribute-valid="paymentTypeCtrl.taxesAlternateDhlAccount.valid"
                                            ewf-validate-attribute-message="{{paymentTypeCtrl.taxesAlternateDhlAccount.message}}">
                                        <span class="validation-mark"></span>
                                        <div ewf-field-errors></div>
                                    </div>
                                </div>
                            </div>

                            <div class="field-wrapper" ng-if="paymentTypeCtrl.isPaymentSplitterShown">
                                <label class="checkbox">
                                    <input type="checkbox" id="split_duty_checkbox" class="checkbox__input" name="splitDutyAndTaxPayment"
                                       ng-model="paymentTypeCtrl.splitDutyAndTaxPayment"
                                       data-aqa-id="split_duty_checkbox">
                                    <span class="label">
                                        <fmt:message key="payment_type_split_duty_and_taxes"/>
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div class="col-4" ng-if="paymentTypeCtrl.isIncotermShown() && paymentTypeCtrl.incoterms.length > 0">
                            <div class="field-wrapper">
                                <label class="label">
                                    <fmt:message key="payment_type_incoterms_title"/>
                                </label>
                                <div class="select select_width_full" ewf-field="incoterm">
                                    <select ng-model="paymentTypeCtrl.incoterm"
                                        ng-options="option as paymentTypeCtrl.resolveIncotermName(option) for option in paymentTypeCtrl.incoterms"
                                        name="incoterm"
                                        ewf-input="paymentType.incoterm"
                                        ewf-validate-required>
                                        <option class="is-hidden" selected disabled value="">
                                            <fmt:message key="payment_type_select_one"/>
                                        </option>
                                    </select>
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ul class="no-bullets" ng-if="(paymentTypeCtrl.quotationType.paymentType || paymentTypeCtrl.transportationPaymentType.paymentType) && paymentTypeCtrl.associatedContact">
                    <li class="single-line">
                        <label class="checkbox checkbox_small">
                            <input type="checkbox" id="accountAddress" class="checkbox__input" ng-model="paymentTypeCtrl.checkedForPaymentAssociation"
                            ng-change="paymentTypeCtrl.onAssociationCheckboxChanged()"
                            data-aqa-id="accountAddress">
                            <span class="label"><fmt:message key="payment_type_associate_options"/></span>
                        </label>
                        <span class="select select_small">
                            <select ng-model="paymentTypeCtrl.associatedContact" ng-options="option.name for option in paymentTypeCtrl.associateWithContacts"></select>
                        </span>
                    </li>
                </ul>
                <footer class="area__footer">
                    <a class="btn btn_success right" ng-click="paymentTypeCtrl.onNextClick(paymentTypeCtrl.paymentTypeForm)"><fmt:message key="next"/></a>
                </footer>
            </section>
            <section class="synopsis" ng-hide="paymentTypeCtrl.editModeActive">
                <a class="synopsis__edit btn btn_action" ng-click="paymentTypeCtrl.onEditClick()"><fmt:message key="edit"/></a>
                <div class="row">
                    <div class="col-6 synopsis_with-icon">
                        <i class="synopsis__icon dhlicon-credit-card"></i>
                        <b><fmt:message key="payment_type_paying_with"/></b> {{ paymentTypeCtrl.transportationPaymentType.title }}
                    </div>
                </div>
            </section>
        </div>
    </div>
</div>
</ewf-payment-type>
