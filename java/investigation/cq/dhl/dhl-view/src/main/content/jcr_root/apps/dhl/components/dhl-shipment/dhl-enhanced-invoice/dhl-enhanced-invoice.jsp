<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle/>
<script>
    document.createElement('ewf-enhanced-invoice');
    dhl.registerComponent('components/shipment/enhanced-invoice/enhanced-invoice-directive');
</script>

<ewf-enhanced-invoice ewf-container ng-form="enhancedInvoiceForm" ewf-form="enhancedInvoice">
    <cq:include script="blocks/dhl-enhanced-invoice-type-selector.jsp"/>

    <div ng-if="enhancedInvoiceCtrl.invoice.invoiceType">
        <cq:include script="blocks/dhl-involved-parties.jsp"/>

        <section class="area"
           ng-if="shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.CREATE">
            <div item-attributes-form></div>
        </section>

        <cq:include script="blocks/dhl-terms.jsp"/>

        <cq:include script="blocks/dhl-references-and-remarks.jsp"/>

        <cq:include script="blocks/dhl-declaration.jsp"/>

        <!-- TODO: Save Time Next Time -->

        <!-- TODO: Additional Customs Documents (Optional) -->

        <section class="area a-right">
            <a class="left margin-top-small"
               ng-click="enhancedInvoiceCtrl.clearInvoice()">
                <fmt:message key="shipment_type_enhanced_customs_clear_button"/>
            </a>
            <button type="button" class="btn btn_action btn_regular margin-left"><fmt:message key="shipment_type_enhanced_customs_preview_button"/></button>
            <button type="button" class="btn btn_success margin-left"><fmt:message key="shipment_type_enhanced_customs_complete_button"/></button>
        </section>
    </div>
</ewf-enhanced-invoice>
