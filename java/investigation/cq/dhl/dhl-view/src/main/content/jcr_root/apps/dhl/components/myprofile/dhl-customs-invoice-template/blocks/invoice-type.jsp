<div class="callout margin-none">
    <div class="row">
        <label class="label"><fmt:message key="customs_invoice_template_label_name"/></label>
        <input type="text" class="input select_width_half"
           placeholder="<fmt:message key="customs_invoice_template_placeholder_name"/>">
    </div>
    <div class="row margin-top-small switcher">
        <label class="label"><fmt:message key="my_product_upload_list_label_invoice_type"/></label>
        <div class="col-4">
            <input type="radio" id="radio_commInvoiceType" class="switcher__input small" name="customsDocType"
               value="Commercial">
            <label for="radio_commInvoiceType" class="switcher__label">
                <fmt:message key="my_product_upload_list_label_commercial_invoice"/>
            </label>
        </div>
        <div class="col-4">
            <input type="radio" id="radio_proFormaType" class="switcher__input small" name="customsDocType"
                value="Proforma">
            <label for="radio_proFormaType" class="switcher__label">
                <fmt:message key="my_product_upload_list_label_proforma_invoice"/>
            </label>
        </div>
    </div>
</div>