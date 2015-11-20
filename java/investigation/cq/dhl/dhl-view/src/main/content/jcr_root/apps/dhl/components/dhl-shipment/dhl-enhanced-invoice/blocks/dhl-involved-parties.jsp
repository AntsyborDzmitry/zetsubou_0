<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle />

<section class="area">
    <h2 class="h2"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_title"/></h2>
    <div class="row field-group">
        <div class="col-5">
            <h3 class="section-title margin-bottom-none"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_shipper"/></h3>
            <div class="address-entry">
                <div class="summary-text">
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.name}}</p>
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.company}}</p>
                    </div>
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.address}}</p>
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.country}}</p>
                    </div>
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.email}}</p>
                        <p ng-if="enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.vat">{{enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.vat}}</p>
                        <div class="field-wrapper"
                           ng-if="!enhancedInvoiceCtrl.invoice.involvedPartiesData.shipper.vat"
                           ewf-field="fromVat">
                            <br>
                            <label for="fromVAT" class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_vat"/></label>
                            <input type="text" class="input input_width_huge" id="fromVat"
                               ng-model="enhancedInvoiceCtrl.invoice.fromVat"
                               ewf-input="enhancedInvoiceForm.fromVat"
                               ewf-validate-required>
                            <span class="validation-mark"></span>
                            <div ewf-field-errors></div>
                        </div>
                    </div>
                    <div class="field-wrapper"
                       ewf-field="exportId">
                        <label for="exportID" class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_exporter_id"/></label>
                        <span class="select select_width_huge">
                            <select name="exportID" id="exportID"
                               ng-model="enhancedInvoiceCtrl.invoice.exportIdType"
                               ng-options="option.value as option.title for option in enhancedInvoiceCtrl.invoice.exporterIdTypes"
                               ewf-input="enhancedInvoiceForm.exportId"
                               ewf-validate-required>
                                <option value=""
                                   ng-if="!enhancedInvoiceCtrl.invoice.exportIdType">
                                </option>
                            </select>
                            <span class="validation-mark"></span>
                        </span>
                    </div>
                    <div class="field-wrapper"
                       ng-if="enhancedInvoiceCtrl.invoice.isCodeSelected()"
                       ewf-field="exportCode">
                        <label for="exportCode" class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_exporter_code"/></label>
                        <input type="text" class="input input_width_huge" id="exportCode"
                           ng-model="enhancedInvoiceCtrl.invoice.exportCode"
                           ewf-input="enhancedInvoiceForm.exportCode"
                           ewf-validate-required>
                        <span class="validation-mark"></span>
                        <div ewf-field-errors></div>
                    </div>

                </div>
            </div>

            <label class="checkbox checkbox_small">
                <input type="checkbox" id="checkbox_invoiceAddressEntry" class="checkbox__input" name="invoiceAddressEntry"
                   ng-model="enhancedInvoiceCtrl.invoice.addressDifferent"
                   data-aqa-id="checkbox_invoiceAddressEntry">
                <span class="label">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_bill_to_address_different"/>
                </span>
            </label>
        </div>

        <div class="col-4">
            <h3 class="section-title margin-bottom-none"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_receiver"/></h3>
            <div class="address-entry" id="toAE">
                <input type="hidden">
                <div class="summary-text">
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.name}}</p>
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.company}}</p>
                    </div>
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.address}}</p>
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.country}}</p>
                    </div>
                    <div class="summary-text__group">
                        <p>{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.email}}</p>
                        <p ng-if="enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.vat">{{enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.vat}}</p>
                        <div class="field-wrapper"
                           ng-if="!enhancedInvoiceCtrl.invoice.involvedPartiesData.receiver.vat"
                           ewf-field="toVat">
                            <br>
                            <label for="fromVAT" class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_vat"/></label>
                            <input type="text" class="input input_width_full" id="toVat"
                               ng-model="enhancedInvoiceCtrl.invoice.toVat"
                               ewf-input="enhancedInvoiceForm.toVat"
                               ewf-validate-required>
                            <span class="validation-mark"></span>
                            <div ewf-field-errors></div>
                        </div>
                    </div>
                    <div class="ewf-autocomplete">
                        <div class="field field_width_full field_with-mark"
                           ewf-field="countriesList">
                            <label class="label"><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_country_of_destination"/></label>
                            <input type="text" name="countryCode" class="input input_width_full"
                                ng-model="enhancedInvoiceCtrl.invoice.country.name"
                                ng-focus="enhancedInvoiceCtrl.invoice.toggleShowCountriesList(true)"
                                ng-change="enhancedInvoiceCtrl.invoice.toggleShowCountriesList(true)"
                                ng-blur="enhancedInvoiceCtrl.invoice.toggleShowCountriesList(false)"
                                ewf-input="enhancedInvoiceForm.countriesList"
                                ewf-validate-required>
                            <span class="validation-mark"></span>
                            <div ewf-field-errors></div>
                            <ul class="ewf-autocomplete__list ui-autocomplete ui-front ui-menu ui-widget ui-widget-conten"
                               ng-if="enhancedInvoiceCtrl.invoice.isCountriesListVisible">
                                <li class="ui-menu-item country-item"
                                    ng-mousedown="enhancedInvoiceCtrl.invoice.pickCountry(country)"
                                    ng-repeat="country in enhancedInvoiceCtrl.invoice.countriesList | filter : {name : enhancedInvoiceCtrl.invoice.country.name}">
                                    {{ country.name }}
                                    <i ng-if="country.code2" class="right flag flag_{{country.code2}}"></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-3">
            <div class="callout callout_carat_left">
                <div class="showcase__title h4">
                    <fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_easy_create_invoice"/>
                </div>
                <div class="showcase__content">
                    <p><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_easy_create_invoice_p1"/></p>
                    <p><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_easy_create_invoice_p2"/></p>
                    <p><fmt:message key="shipment_type_enhanced_customs_invoice_involved_parties_easy_create_invoice_p3"/></p>
                </div>
            </div>
        </div>
    </div>

    <div ng-if="enhancedInvoiceCtrl.invoice.addressDifferent">
        <cq:include script="blocks/dhl-invoice-address.jsp"/>
    </div>

</section>