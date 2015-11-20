<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle/>

<section class="area">
    <h3><fmt:message key="shipment_type_packages_customs_invoice_create_title"/></h3>
    <p><fmt:message key="shipment_type_enhanced_customs_invoice_description"/></p>
    <div class="row">
        <div class="callout col-8">
            <div class="row">
                <div class="switcher switcher_width_full col-5">
                    <input type="radio" class="switcher__input" name="invoiceType" value="COMMERCIAL" id="radio_customsInvoiceType_commercial"
                       ng-model="enhancedInvoiceCtrl.invoice.invoiceType"
                       ng-class="{checked : enhancedInvoiceCtrl.invoice.invoiceType === enhancedInvoiceCtrl.invoice.invoiceTypes.COMMERCIAL}">
                    <label for="radio_customsInvoiceType_commercial" class="switcher__label"
                       ng-click="enhancedInvoiceCtrl.invoice.invoiceType = enhancedInvoiceCtrl.invoice.invoiceTypes.COMMERCIAL">
                        <i class="dhlicon-commercial"></i>
                        <fmt:message key="shipment_type_enhanced_customs_invoice_commercial_title"/>
                    </label>
                    <div class="switcher__details">
                        <fmt:message key="shipment_type_enhanced_customs_invoice_commercial_description"/>
                    </div>
                </div>
        
                <div class="col-2 a-center margin-top">
                    <b><fmt:message key="shipment_type_enhanced_customs_invoice_switchers_divider"/></b>
                </div>
        
                <div class="switcher switcher_width_full col-5">
                    <input type="radio" class="switcher__input" name="invoiceType" value="PROFORMA" id="radio_customsInvoiceType_proforma"
                       ng-model="enhancedInvoiceCtrl.invoice.invoiceType"
                       ng-class="{checked : enhancedInvoiceCtrl.invoice.invoiceType === enhancedInvoiceCtrl.invoice.invoiceTypes.PROFORMA}">
                    <label for="radio_customsInvoiceType_proforma" class="switcher__label"
                       ng-click="enhancedInvoiceCtrl.invoice.invoiceType = enhancedInvoiceCtrl.invoice.invoiceTypes.PROFORMA">
                        <i class="dhlicon-proforma"></i>
                        <fmt:message key="shipment_type_enhanced_customs_invoice_proforma_title"/>
                    </label>
                    <div class="switcher__details">
                        <fmt:message key="shipment_type_enhanced_customs_invoice_proforma_description"/>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="callout col-4 margin-top-none margin-bottom-none">
            <h4 class="margin-none"><fmt:message key="shipment_type_enhanced_customs_invoice_create_this_invoice_title"/></h4>
            <p class="margin-top-small margin-bottom-small">
                <small><fmt:message key="shipment_type_enhanced_customs_invoice_create_this_invoice_description"/></small>
            </p>
            <a ng-click="enhancedInvoiceCtrl.showSavedCustomsTemplatesPopup()">
               <fmt:message key="shipment_type_enhanced_customs_invoice_select_saved_template_link"/>
            </a>
        </div>
    </div>
</section>