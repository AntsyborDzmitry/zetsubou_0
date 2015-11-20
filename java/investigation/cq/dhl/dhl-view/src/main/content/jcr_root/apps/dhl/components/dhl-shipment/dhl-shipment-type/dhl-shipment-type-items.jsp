<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<div class="field form-row" ng-if="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.DOCUMENT">
    <div class="fw-bold">
        <fmt:message key="shipment_type_describe_documents"/>
    </div>
    <input
        type="text"
        class="input input_width_half"
        name="documentDescription"
        placeholder="<fmt:message key="shipment_type_describe_documents_placeholder"/>"
        ng-model="shipmentTypeCtrl.documentDescription"
        ewf-input="shipmentTypeForm.documentDescription"
        ewf-validate-required>
    <span class="validation-mark"></span>
    <div class="msg-error msg-error_left" ng-if="shipmentTypeCtrl.error" nls="{{shipmentTypeCtrl.error}}" nls-bind></div>
</div>

<div ng-if="shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.DOCUMENT">

    <div ewf-field="primaryReference" class="form-row" ng-if="shipmentTypeCtrl.referenceBehavior !== 'none'">
        <span ng-if="!shipmentTypeCtrl.customReferenceCaption">
            <div class="fw-bold"><fmt:message key="shipment_type_add_reference"/></div>
        </span>
        <span ng-if="shipmentTypeCtrl.customReferenceCaption">
            <div class="fw-bold">{{ shipmentTypeCtrl.customReferenceCaption }}</div>
        </span>
        <div class="reference-list">
            <div class="field form-row ewf-autocomplete">
                <label class="label">
                    <fmt:message key="shipment_type_reference_appears_on_waybill"/>
                </label>
                <input type="text" class="input input_width_half" name="primaryReferenceNoValidate"
                   placeholder="<fmt:message key="shipment_type_optional_waybill.placeholder"/>"
                   ng-disabled="shipmentTypeCtrl.isReferenceDisabled()"
                   ng-if="shipmentTypeCtrl.referenceBehavior !== 'mandatory'"
                   ng-model="shipmentTypeCtrl.primaryReference.name"
                   ng-focus="shipmentTypeCtrl.referencesListVisible()"
                   ng-blur="shipmentTypeCtrl.isReferencesListVisibleForPrimary = false">
                <input type="text" class="input input_width_half" name="primaryReference"
                   placeholder="<fmt:message key="shipment_type_optional_waybill.placeholder"/>"
                   ng-disabled="shipmentTypeCtrl.isReferenceDisabled()"
                   ng-if="shipmentTypeCtrl.referenceBehavior === 'mandatory'"
                   ng-model="shipmentTypeCtrl.primaryReference.name"
                   ng-focus="shipmentTypeCtrl.referencesListVisible()"
                   ng-blur="shipmentTypeCtrl.isReferencesListVisibleForPrimary = false"
                   ewf-input="shipmentTypeForm.primaryReference"
                   ewf-validate-required>
                <ul class="ewf-autocomplete__list ui-autocomplete ui-front ui-menu ui-widget ui-widget-conten" ng-if="shipmentTypeCtrl.isReferencesListVisibleForPrimary">
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.toContactReferences | filter : {name: shipmentTypeCtrl.primaryReference.name}).length"><fmt:message key="shipment_type_ship_to"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(shipmentTypeCtrl.primaryReference, ref)" ng-repeat="ref in shipmentTypeCtrl.toContactReferences | filter : {name : shipmentTypeCtrl.primaryReference.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.fromContactReferences | filter : {name: shipmentTypeCtrl.primaryReference.name}).length"><fmt:message key="shipment_type_ship_from"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(shipmentTypeCtrl.primaryReference, ref)" ng-repeat="ref in shipmentTypeCtrl.fromContactReferences | filter : {name : shipmentTypeCtrl.primaryReference.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.userProfileReferences | filter : {name: shipmentTypeCtrl.primaryReference.name}).length"><fmt:message key="common.user"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(shipmentTypeCtrl.primaryReference, ref)" ng-repeat="ref in shipmentTypeCtrl.userProfileReferences | filter : {name : shipmentTypeCtrl.primaryReference.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                </ul>
                <span class="validation-mark"></span>
                <div class="msg-error_left" ewf-field-errors></div>
            </div>
            <label ng-if="shipmentTypeCtrl.additionalReferences.length" class="label">
                <fmt:message key="shipment_type_reference_additional"/>
            </label>
            <div class="field form-row ewf-autocomplete" ng-repeat="row in shipmentTypeCtrl.additionalReferences">
                <input type="text" class="input input_width_half" name="shipment_references[]"
                   placeholder="<fmt:message key="shipment_type_references_placeholder"/>"
                   ng-model="row.name"
                   ng-disabled="row.type === 'MANDATORY'"
                   ng-focus="shipmentTypeCtrl.referencesListVisible(row)"
                   ng-blur="row.isReferencesListVisible = false">
                <span class="validation-mark"></span>
                <ul class="ewf-autocomplete__list ui-autocomplete ui-front ui-menu ui-widget ui-widget-conten" ng-if="row.isReferencesListVisible">
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.toContactReferences | filter : row.name).length"><fmt:message key="shipment_type_ship_to"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(row, ref)" ng-repeat="ref in shipmentTypeCtrl.toContactReferences | filter : {name : row.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.fromContactReferences | filter : row.name).length"><fmt:message key="shipment_type_ship_from"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(row, ref)" ng-repeat="ref in shipmentTypeCtrl.fromContactReferences | filter : {name : row.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                    <li class="ui-autocomplete-category" ng-if="(shipmentTypeCtrl.userProfileReferences | filter : row.name).length"><fmt:message key="common.user"/></li>
                    <li ng-mousedown="shipmentTypeCtrl.pickReference(row, ref)" ng-repeat="ref in shipmentTypeCtrl.userProfileReferences | filter : {name : row.name}">
                        <strong>{{ ref.name }}</strong>
                    </li>
                </ul>
                <button ng-if="row.type !== 'MANDATORY'" type="button" class="btn btn_action" ng-click="shipmentTypeCtrl.removeReference(row)">
                    <i class="dhlicon dhlicon-remove"></i>
                    <fmt:message key="common.remove"/>
                </button>
                <span class="validation-mark"></span>
            </div>
            <button type="button" class="btn btn_small btn_animate"
               ng-click="shipmentTypeCtrl.addReference()">
                <i class="dhlicon-add"></i><span class="btn__text"><fmt:message key="shipment_type_add_another_reference"/></span>
            </button>
        </div>
    </div>
</div>

<!-- TODO: reuse existing summzarize & references block; remove this mock -->
<div ng-if="shipmentTypeCtrl.customsInvoiceType === shipmentTypeCtrl.CUSTOMS_INVOICE_TYPE.USE && shipmentTypeCtrl.shipmentType === shipmentTypeCtrl.SHIPMENT_TYPE.PACKAGE">
    <div>
        <div class="field-wrapper margin-top">
            <div class="fw-bold">Summarize the contents of your shipment</div>
            <input type="text" class="input input_width_half" name="invoiceDescription" placeholder="e.g., office supplies, auto parts, clothing, etc.">
        </div>
        <div class="form-row">
            <div class="fw-bold">Add your own reference for this shipment?</div>
            <reference-list>
                <div class="reference-list">
                    <div class="field form-row">
                        <label class="label">Reference (appears on label/waybill)</label>
                        <input name="shipment_references[]" class="input input_width_half" placeholder="Optional">
                        <span class="validation-mark"></span>
                        <div class="msg-error"></div>
                    </div>
                    <button type="button" class="btn btn_small btn_animate">
                        <div>
                            <i class="dhlicon-add"></i><span class="btn__text">Add Another Reference</span>
                        </div>
                    </button>
                </div>
            </reference-list>
        </div>
        <div class="row">
            <div class="col-8 callout">
                <h4 class="h4 section-title">
                  What is the value of your shipment? <a class="info"><div>We offer financial protection against all risks of physical shipment loss or damage, from any external cause, in addition to the standard DHL EXPRESS liability. Cover is limited to the value declared by the shipper, replacement cost, invoice value or actual cash value, whichever is the lowest. Conditions apply.</div></a>
                    </h4>
                <div class="field-wrapper">
                    <span>$</span>
                    <input type="text" class="input input_width_small" name="shipmentValue" placeholder="00.00" data-input="number" data-min="0.00" data-interval="1.00" size="5">
                    <select class="select-units" name="shipmentValueCurrency">
                        <option value="object:642" label="AED">AED</option>
                        <option value="object:643" label="AFN">AFN</option>
                        <option value="object:644" label="ALL">ALL</option>
                        <option value="object:645" label="AMD">AMD</option>
                        <option value="object:646" label="AOA">AOA</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-8 callout margin-top">
                <h4 class="h4 section-title">Protect Your Shipment</h4>
                <p>You value your shipment and so do we! Don't forget to insure your shipment.
                    <br>
                    <small><a href="#">Learn More</a></small></p>

                <label class="checkbox">
                    <input type="checkbox" id="checkbox_insureShipment" class="checkbox__input" name="insureShipment"
                       data-aqa-id="checkbox_insureShipment">
                    <span class="label">
                        <fmt:message key="shipment_type_checkbox_insure_shipment"/>
                    </span>
                </label>
            </div>
        </div>
    </div>

    <div ewf-itar></div>
</div>
