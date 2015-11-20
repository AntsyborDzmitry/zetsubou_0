<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle />

<section class="area">
    <h2 class="h2"><fmt:message key="shipment_type_enhanced_customs_invoice_references_remarks_title"/></h2>
    <div class="row">
        <div class="col-4">
            <div class="field form-row">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_date"/></label>
                <input type="text" class="input input_width_full" id="invoiceDate" disabled
                   ng-model="enhancedInvoiceCtrl.invoice.currentDate">
            </div>

            <div class="field form-row">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_number"/>
                    <a class="info"><span><fmt:message key="shipment_type_enhanced_customs_invoice_number_add"/></span></a>
                </label>
                <input type="text" class="input input_width_full" name="invoiceNumber"
                   ng-model="enhancedInvoiceCtrl.invoice.invoiceNumber">
                <span class="validation-mark"></span>
            </div>

            <div class="field form-row">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_reference_add"/>
                    <a class="info"><span><fmt:message key="shipment_type_enhanced_customs_invoice_reference_print"/></span></a>
                </label>
                <input type="text" class="input input_width_full" name="shipperReference"
                   ng-model="enhancedInvoiceCtrl.invoice.shipperReference">
            </div>

            <div class="field form-row">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_reference_receiver"/>
                    <a class="info"><span><fmt:message key="shipment_type_enhanced_customs_invoice_reference_print"/></span></a>
                </label>
                <input type="text" class="input input_width_full" name="receiverReference"
                   ng-model="enhancedInvoiceCtrl.invoice.receiverReference">
            </div>
        </div>
        <div class="col-4">
            <div class="field form-row">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_carrier"/></label>
                <b class="field-row-text"><fmt:message key="shipment_type_enhanced_customs_invoice_dhl"/></b>
            </div>
            <div class="field form-row">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_package_marks"/>
                    <a class="info"></a>
                </label>
                <input type="text" class="input input_width_full" name="packageMarks"
                   ng-model="enhancedInvoiceCtrl.invoice.packageMarks">
            </div>
            <div class="field form-row">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_requires_pediment"/>
                    <a class="info"></a>
                </label>
                <div class="select select_width_full">
                    <select name="requiresPediment" id="requiresPediment"
                       ng-model="enhancedInvoiceCtrl.invoice.requiresPediment"
                       ng-options="pediment.value as (pediment.nls | translate) for pediment in enhancedInvoiceCtrl.invoice.requiresPedimentOptions">
                    </select>
                </div>
            </div>
            <div class="field">
                <label class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_text_clauses_regulations"/>
                    <a class="info"></a>
                </label>
                <input type="text" class="input input_width_full" name="clauses"
                   ng-model="enhancedInvoiceCtrl.invoice.clauses">
            </div>
        </div>
        <div class="col-4">
            <div class="field">
                <label for="comments" class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_remarks"/>:</label>
                <textarea class="textarea textarea_width_full textarea_height_big" name="invoiceComments" id="comments" rows="5"
                   ng-model="enhancedInvoiceCtrl.invoice.invoiceRemarks">
                </textarea>
            </div>
        </div>
    </div>
</section>