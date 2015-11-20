<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-shipment-type,
            item-attributes,
            item-attributes-form,
            ewf-itar"
        paths="components/shipment/shipment-type/ewf-shipment-type-directive,
            components/shipment/shipment-type/item-attributes/item-attributes-directive,
            components/shipment/shipment-type/item-attributes/item-attributes-form-directive,
            directives/ewf-validate/ewf-validate-equality-directive"/>

<script type="text/ng-template" id="itar-itn-template">
    <div class="col-6 field-wrapper" ewf-field="itn">
        <input type="text" class="input input_width_full" name="itn" maxlength="15"
           ng-model="itarCtrl.itnNumber"
           ewf-input="itarForm.itn"
           ewf-validate-required
           ewf-validate-pattern="{{itarCtrl.PATTERNS.ITN}}">
        <span class="validation-mark"></span>
        <div ewf-field-errors></div>
    </div>
    <div class="col-6">
        <a ng-href="{{ itarCtrl.itnLink }}" target="_blank" nls="shipment.shipment_type_itar_login_link"></a>
    </div>
</script>
<ewf-shipment-type ewf-container>
    <div id="section_shipmentType" class="area-wrap"
            ng-cloak
            ng-if="shipmentTypeCtrl.initialized">
        <section id="shipmentType" class="area" ng-show="shipmentTypeCtrl.editModeActive">
            <header class="area__header">
                <h2 class="area__title h2"><fmt:message key="shipment_type_title"/></h2>
            </header>

            <div class="area__content" ng-form="shipmentTypeForm" ewf-form="shipmentType">
                <div class="field-group callout-holder"
                   ng-class="{row : !shipmentTypeCtrl.isEnhancedCustomsInvoiceVisible()}">
                    <div class="col-8">
                        <div class="row">
                            <div class="col-6">
                                <div class="switcher switcher_width_full">
                                    <input type="radio" class="switcher__input" name="shipmentType" value="DOCUMENT" id="radio_shipmentType_documents"
                                       ng-model="shipmentTypeCtrl.shipmentType"
                                       ng-class="{checked : shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.DOCUMENT}">
                                    <label for="radio_shipmentType_documents" class="switcher__label"
                                       ng-click="shipmentTypeCtrl.updateShipmentType(shipmentTypeCtrl.SHIPMENT_TYPE.DOCUMENT)">
                                        <i class="dhlicon-documents"></i><fmt:message key="common.documents"/>
                                    </label>
                                    <input type="hidden" ng-model="shipmentTypeCtrl.shipmentType">
                                    <div class="switcher__details"><fmt:message key="shipment_type_documents_sublabel"/></div>
                                </div>
                            </div>

                            <div class="col-6">
                                <div class="switcher switcher_width_full">
                                    <input type="radio" class="switcher__input" name="shipmentType" value="PACKAGE" id="radio_shipmentType_packages"
                                       ng-model="shipmentTypeCtrl.shipmentType"
                                       ng-class="{checked : shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE}">
                                    <label for="radio_shipmentType_packages" class="switcher__label"
                                       ng-click="shipmentTypeCtrl.updateShipmentType(shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE)">
                                        <i class="dhlicon-packages"></i><fmt:message key="common.packages"/>
                                    </label>
                                    <div class="switcher__details"><fmt:message key="shipment_type_packages_sublabel"/></div>
                                </div>
                            </div>
                        </div>

                        <div ng-if="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE">
                            <p class="h5">
                                <fmt:message key="shipment_type_packages_customs_invoice_title"/>
                                <small>
                                    <a class="info">
                                        <span>
                                            <fmt:message key="shipment_type_packages_customs_invoice_about"/>
                                            <br><br>
                                            <fmt:message key="shipment_type_packages_customs_invoice_about_customs"/>
                                        </span>
                                    </a>
                                </small>
                            </p>

                            <div class="row">
                                <div class="col-6">
                                    <div class="switcher switcher_width_full">
                                        <input type="radio" class="switcher__input" name="customsInvoiceType" value="CREATE" id="radio_customsInvoiceType_create"
                                           ng-model="shipmentTypeCtrl.customsInvoiceType"
                                           ng-class="{checked : shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.CREATE}">
                                        <label for="radio_customsInvoiceType_create" class="switcher__label"
                                           ng-click="shipmentTypeCtrl.updateCustomsInvoiceType(shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.CREATE)">
                                            <fmt:message key="shipment_type_packages_customs_invoice_create_title"/>
                                        </label>
                                        <input type="hidden" ng-model="shipmentTypeCtrl.customsInvoiceType">
                                        <div class="switcher__details"><fmt:message key="shipment_type_packages_customs_invoice_create_sublabel"/></div>
                                    </div>
                                </div>

                                <div class="col-6">
                                    <div class="switcher switcher_width_full">
                                        <input type="radio" class="switcher__input" name="customsInvoiceType" value="USE" id="radio_customsInvoiceType_use"
                                           ng-model="shipmentTypeCtrl.customsInvoiceType"
                                           ng-class="{checked : shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.USE}">
                                        <label for="radio_customsInvoiceType_use" class="switcher__label"
                                           ng-click="shipmentTypeCtrl.updateCustomsInvoiceType(shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.USE)">
                                            <fmt:message key="shipment_type_packages_customs_invoice_useown_title"/>
                                        </label>
                                        <div class="switcher__details"><fmt:message key="shipment_type_packages_customs_invoice_useown_sublabel"/></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="callout callout_carat_left col-4 margin-top-none" ng-if="!shipmentTypeCtrl.shipmentType">
                        <h4 class="h4 callout__title"><fmt:message key="shipment_type_document_or_package"/></h4>
                        <div class="callout__content">
                            <i class="dhlicon-carat-right"></i><a ng-click="showCommodityStatusModal();"><fmt:message key="shipment_type_help_decide"/></a>
                        </div>
                    </div>

                    <div class="col-4 row" ng-class="{right : shipmentTypeCtrl.isEnhancedCustomsInvoiceVisible()}">
                        <div class="callout callout_carat_left"
                           ng-if="shipmentTypeCtrl.shipmentType"
                           ng-class="{callout_absolute : !shipmentTypeCtrl.isEnhancedCustomsInvoiceVisible()}">
                            <h4 class="h4 callout__title"><fmt:message key="shipment_type_packages_prohibited_items"/></h4>
                            <div class="callout__content">
                                <fmt:message key="shipment_type_packages_prohibited_items_description"/>
                                <small>
                                    <ul class="no-bullets padding-side">
                                        <li><fmt:message key="shipment_type_packages_prohibited_items_item1"/></li>
                                        <li><fmt:message key="shipment_type_packages_prohibited_items_item2"/></li>
                                        <li><fmt:message key="shipment_type_packages_prohibited_items_item3"/></li>
                                    </ul>
                                </small>
                                <a>
                                    <fmt:message key="shipment_type_packages_prohibited_items_view_all"/>
                                </a>
                            </div>
                        </div>

                        <div class="callout" ng-if="shipmentTypeCtrl.isEnhancedCustomsInvoiceVisible()">
                            <p><fmt:message key="shipment_type_enhanced_customs_invoice_callout_link_description"/></p>
                            <a ng-click="shipmentCtrl.triggerMainFlowVisibility()">
                                <fmt:message key="shipment_type_enhanced_customs_invoice_callout_link_label"/>
                            </a>
                        </div>
                    </div>
                </div>

                <item-attributes ng-if="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE && shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.CREATE"></item-attributes>

                <cq:include script="dhl-shipment-type-items.jsp"/>

            </div>
            <footer class="area__footer clear a-right" ng-if="shipmentTypeCtrl.isNextButtonVisible()">
                <a class="btn btn_success right" ng-click="shipmentTypeCtrl.onNextClick(shipmentTypeForm, ewfFormCtrl)">
                    <fmt:message key="common.next"/>
                </a>
            </footer>
        </section>

        <div class="synopsis" ng-show="!shipmentTypeCtrl.editModeActive">
            <a class="synopsis__edit btn btn_action" ng-click="shipmentTypeCtrl.onEditClick()"><fmt:message key="common.edit"/></a>
            <div class="row">
                <div ng-show="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.DOCUMENT" class="synopsis_with-icon">
                    <i class="synopsis__icon dhlicon-documents"></i>
                    <b><fmt:message key="shipment_type_documents"/></b>
                </div>

                <div ng-show="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE">
                    <div class="col-6 synopsis_with-icon">
                        <i class="synopsis__icon dhlicon-packages"></i>
                        <b><fmt:message key="shipment_type_packages"/></b>
                        <div ng-repeat="item in shipmentTypeCtrl.packages.list">
                            {{item.quantity}}
                            {{item.description}}
                            ({{item.value}} <span nls="shipment.shipment_type_packages_each"></span>)
                        </div>
                    </div>
                    <div class="col-6">
                        <fmt:message key="shipment_type_custom_declared_value"/>
                        {{shipmentTypeCtrl.packages.total}}
                    </div>
                </div>
            </div>
        </div>

    </div>

</ewf-shipment-type>