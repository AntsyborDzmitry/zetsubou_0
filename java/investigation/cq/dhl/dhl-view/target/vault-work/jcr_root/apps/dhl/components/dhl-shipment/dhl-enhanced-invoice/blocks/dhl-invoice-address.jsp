<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle />

<script>
    dhl.registerComponent('directives/ewf-validate/ewf-validate-email-directive');
</script>

<div ewf-enhanced-invoice-address ng-form="enhancedInvoiceAddressCtrl.form" ewf-form="invoiceContactDetails" novalidate>
    <div class="row">
        <div class="col-5">
            <cq:include path="invoiceContactAddress" resourceType="dhl/components/addressbook/dhl-address"/>
            <div class="field-wrapper"
               ewf-field="email">
                <label class="label" for="enhanced-address-email"><fmt:message key="address_details.email"/></label>
                <input id="enhanced-address-email" class="input input_width_full" type="text"
                   ng-model="enhancedInvoiceAddressCtrl.invoice.contactDetails.email"
                   ewf-input="invoiceContactDetails.email"
                   ewf-validate-required
                   ewf-validate-email>
                 <span class="validation-mark"></span>
                 <div ewf-field-errors></div>
            </div>
            <cq:include path="invoiceContactPhone" resourceType="dhl/components/addressbook/dhl-phone-component"/>
            <div class="row">
                <div class="field-wrapper">
                    <label class="label">
                        <fmt:message key="shipment_type_packages_customs_invoice_vat"/>
                        <input class="input input_width_full" type="text" name="vatTax"
                           ng-model="enhancedInvoiceAddressCtrl.invoice.contactDetails.vatTax">
                    </label>
                </div>
            </div>
            <div class="row" ng-if="!enhancedInvoiceAddressCtrl.anyActionConfirmed()">
                <button type="button" class="btn btn_action"
                   ng-if="enhancedInvoiceAddressCtrl.showButtons"
                   ng-click="enhancedInvoiceAddressCtrl.showSaveContactDialog()">
                    <fmt:message key="address_details_save_contact"/>
                </button>
                <button type="button" class="btn btn_action"
                   ng-if="enhancedInvoiceAddressCtrl.showButtons"
                   ng-click="enhancedInvoiceAddressCtrl.updateContact()">
                    <fmt:message key="address_details_update_contact"/>
                </button>
            </div>
            <div class="row" ng-if="enhancedInvoiceAddressCtrl.updateConfirmed">
                <i class="dhlicon-check"></i><fmt:message key="address_details_address_updated"/>
            </div>
            <div class="row"
               ng-if="enhancedInvoiceAddressCtrl.saveConfirmed">
                <i class="dhlicon-check"></i><fmt:message key="address_details_address_saved"/> {{enhancedInvoiceAddressCtrl.nickName}}
            </div>
            <p ng-if="enhancedInvoiceAddressCtrl.showButtons">
                <a ng-click="enhancedInvoiceAddressCtrl.clearAddress()">
                    <fmt:message key="address_details.clear_address"/>
                </a>
            </p>
        </div>
    </div>
</div>