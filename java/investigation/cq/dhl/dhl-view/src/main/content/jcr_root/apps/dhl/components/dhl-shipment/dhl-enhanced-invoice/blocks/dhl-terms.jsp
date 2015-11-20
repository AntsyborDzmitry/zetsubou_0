<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle />

<section class="area">
    <h2 class="h2"><fmt:message key="shipment_type_enhanced_customs_terms"/></h2>
    <div class="form-row">
        <div class="col-4">
            <div class="field-wrapper"
               ewf-field="typeOfExport">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_type_of_export"/></label>
                <span class="select select_width_full">
                    <select name="typeOfExport"
                       ng-model="enhancedInvoiceCtrl.invoice.typeOfExport"
                       ewf-input="enhancedInvoiceForm.typeOfExport"
                       ewf-validate-required>
                        <option value="Permanent"><fmt:message key="shipment_type_enhanced_customs_terms_permanent"/></option>
                        <option value="Temporary"><fmt:message key="shipment_type_enhanced_customs_terms_temporary"/></option>
                        <option value="Return"><fmt:message key="shipment_type_enhanced_customs_terms_return_repair"/></option>
                    </select>
                    <span class="validation-mark"></span>
                </span>
            </div>

            <div class="field-wrapper"
               ewf-field="reasonForExport">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_terms_reason_for_export"/>
                    <a class="info"><span><fmt:message key="shipment_type_enhanced_customs_terms_reason_for_export_tooltip"/></span></a>
                </label>
                <span class="select select_width_full">
                    <select name="reasonForExport"
                       ng-model="enhancedInvoiceCtrl.invoice.reasonForExport"
                       ewf-input="enhancedInvoiceForm.reasonForExport"
                       ewf-validate-required>
                        <option value="gift"><fmt:message key="shipment_type_enhanced_customs_terms_gift"/></option>
                        <option value="sale"><fmt:message key="shipment_type_enhanced_customs_terms_commercial_purposes"/></option>
                        <option value="personalBelongings"><fmt:message key="shipment_type_enhanced_customs_terms_personal_belonging"/></option>
                        <option value="sample"><fmt:message key="shipment_type_enhanced_customs_terms_sample"/></option>
                        <option value="returnForRepair"><fmt:message key="shipment_type_enhanced_customs_terms_return_for_repair"/></option>
                        <option value="returnAfterRepair"><fmt:message key="shipment_type_enhanced_customs_terms_return_after_repair"/></option>
                        <option value="intercompanyTransfer"><fmt:message key="shipment_type_enhanced_customs_terms_intercompany_transfer"/></option>
                    </select>
                    <span class="validation-mark"></span>
                </span>
            </div>

            <div class="field-wrapper"
               ewf-field="termsOfTrade">
                <a class="section-help__link right"><fmt:message key="shipment_type_enhanced_customs_terms_help_me"/></a>
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_terms_of_trade"/></label>
                <span class="select select_width_full">
                    <select name="termsOfTrade"
                       ng-model="enhancedInvoiceCtrl.invoice.termsOfTrade"
                       ewf-input="enhancedInvoiceForm.termsOfTrade"
                       ewf-validate-required>
                        <option value="CIP"><fmt:message key="shipment_type_enhanced_customs_terms_cip"/></option>
                        <option value="CPT"><fmt:message key="shipment_type_enhanced_customs_terms_cpt"/></option>
                        <option value="DAP"><fmt:message key="shipment_type_enhanced_customs_terms_dap"/></option>
                        <option value="DAT"><fmt:message key="shipment_type_enhanced_customs_terms_dat"/></option>
                        <option value="DTP"><fmt:message key="shipment_type_enhanced_customs_terms_dtp"/></option>
                        <option value="EXW"><fmt:message key="shipment_type_enhanced_customs_terms_exw"/></option>
                        <option value="FCA"><fmt:message key="shipment_type_enhanced_customs_terms_fca"/></option>
                    </select>
                    <span class="validation-mark"></span>
                </span>
            </div>
            <div class="field-wrapper">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_destination_port"/></label>
                <input type="text" class="input input_width_full"
                   ng-model="enhancedInvoiceCtrl.invoice.namedDestinationPort">
            </div>
        </div>

        <div class="col-4">
            <div class="field-wrapper"
               ewf-field="paymentAccount">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_taxes_account"/></label>
                <div class="select select_width_full">
                    <select name="pay_for_shipping"
                       ng-model="enhancedInvoiceCtrl.invoice.paymentAccount"
                       ng-options="accountType.value as (accountType.nls | translate) for accountType in enhancedInvoiceCtrl.invoice.paymentOptions"
                       ewf-input="enhancedInvoiceForm.paymentAccount"
                       ewf-validate-required>
                    </select>
                    <span class="validation-mark"></span>
                </div>
            </div>
            <div class="field-wrapper"
               ng-if="enhancedInvoiceCtrl.invoice.paymentAccount === 'ALTERNATE'"
               ewf-field="dutyTaxesAccountNbr">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_account_number"/></label>
                <input type="text" class="input"
                   ng-model="enhancedInvoiceCtrl.invoice.dutyTaxesAccountNbr"
                   ewf-input="enhancedInvoiceForm.dutyTaxesAccountNbr"
                   ewf-validate-required>
                <span class="validation-mark"></span>
                <div ewf-field-errors></div>
            </div>

            <div class="field-wrapper">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_payment"/></label>
                <input type="text" class="input input_width_full" placeholder="<fmt:message key="shipment_type_enhanced_customs_terms_payment.placeholder"/>"
                   ng-model="enhancedInvoiceCtrl.invoice.termsOfPayment">
            </div>

            <div class="field-wrapper">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_terms_billing_service"/></label>
                <label class="label"><b><fmt:message key="shipment_type_enhanced_customs_terms_dtu"/></b></label>
            </div>
        </div>
    </div>
</section>