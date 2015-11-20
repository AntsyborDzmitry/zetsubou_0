<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="shipment-insurance,
            pickups-directive,
            return-shipments,
            saving-shipments,
            assigning-shipments,
            ewf-som-currency,
            delivery-options,
            address-entry,
            customs-clearance"
        paths="components/profile-shipment-defaults/assigning-shipments/assigning-shipments-directive,
            components/profile-shipment-defaults/saving-shipments/saving-shipments-directive,
            components/profile-shipment-defaults/insurance/shipment-insurance-directive,
            components/profile-shipment-defaults/pickups/pickups-directive,
            components/profile-shipment-defaults/return-shipments/return-shipments-directive,
            components/profile-shipment-defaults/som-currency/som-currency-directive,
            components/profile-shipment-defaults/delivery-options/delivery-options-directive,
            components/profile-shipment-defaults/address-entry/address-entry-directive,
            components/profile-shipment-defaults/customs-clearance/customs-clearance-directive,
            directives/ewf-form/ewf-form-directive"
        />

<div class="row">
    <h3 class="margin-top-none"><fmt:message key="dhl_shipment_settings_my_defaults_title"/></h3>
    <div class="row"><fmt:message key="contact_information_label"/></div>
</div>

<div class="row margin-top padding-side">
    <div class="col-11">

        <delivery-options>
            <script type="text/ng-template" id="shipment-options.html">
                <a>
                    <span><i class="flag flag_{{match.model.code2}}"></i>{{match.model.name}}</span>
                </a>
            </script>
            <form novalidate name="shipmentDefaults">
                <div class="overlay-white">
                    <div class="nav right">
                        <a class="nav__item btn btn_action dhlicon-pencil" id="delOpts_EditBtn"
                           ng-if="!deliveryOptionsCtrl.editMode"
                           ng-click="deliveryOptionsCtrl.toggleEditMode()">
                            <fmt:message key="edit_button"/>
                        </a>
                        <a class="small"
                           ng-click="deliveryOptionsCtrl.toggleEditMode()"
                           ng-if="deliveryOptionsCtrl.editMode">
                            <fmt:message key="close_link"/>
                        </a>
                    </div>
                    <h3 class="margin-none">
                        <fmt:message key="delivery_options_default__heading"/>
                    </h3>
                    <div ng-if="deliveryOptionsCtrl.editMode">
                        <div class="row margin-top">
                            <b><fmt:message key="delivery_options_default__shipment_type_label"/></b>
                            <a id="delOpts_clearBtn"
                               ng-click="deliveryOptionsCtrl.resetShipmentType()">
                                <fmt:message key="clear_selection_link"/>
                            </a>
                            <div class="row m-top-small">
                                <div class="col-5">
                                    <div class="radio field-wrapper">
                                        <input type="radio" class="radio__input" name="shipmentType" value="DOCUMENT" id="delOpts_documentsRadio"
                                           ng-model="deliveryOptionsCtrl.options.shipmentType">
                                        <label for="delOpts_documentsRadio" class="label">
                                            <div><fmt:message key="delivery_options_default__documents"/></div>
                                            <div class="text_gray font_small"><fmt:message key="delivery_options_default__documents_info"/></div>
                                        </label>
                                    </div>
                                </div>
                                <div class="col-5">
                                    <div class="radio field-wrapper">
                                        <input type="radio" class="radio__input" name="shipmentType" value="PACKAGE" id="delOpts_packagesRadio"
                                           ng-model="deliveryOptionsCtrl.options.shipmentType">
                                        <label for="delOpts_packagesRadio" class="label">
                                            <div><fmt:message key="delivery_options_default__packages"/></div>
                                            <div class="text_gray font_small"><fmt:message key="delivery_options_default__packages_info"/></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="form-row field margin-top-small"
                           ng-if="deliveryOptionsCtrl.isDocumentType()">
                            <div class="fw-bold"><fmt:message key="delivery_options_default__documents_label"/></div>
                            <div>
                                <input type="text" class="input input_width_full" id="account_name" placeholder="<fmt:message key="delivery_options_default__documents_placeholder"/>" id="delOpts_documentsInput"
                                   ng-model="deliveryOptionsCtrl.options.documentDescription">
                            </div>
                        </div>
                        <div class="form-row field margin-top-small">
                            <div class="col-6">
                                <div class="field-wrapper">
                                    <label class="label"><fmt:message key="delivery_options_default__option"/></label>
                                    <span class="select select_width_half">
                                        <select class="" id="delOpts_optionSelect"
                                           ng-options="(('shipment-settings.' + deliveryOption.name) | translate) for deliveryOption in deliveryOptionsCtrl.options.deliveryOptions"
                                           ng-model="deliveryOptionsCtrl.selectedOption">
                                            <option value=""><fmt:message key="delivery_options_select_default"/></option>
                                        </select>
                                    </span>
                                </div>
                                <div class="field-wrapper">
                                    <label class="label"><fmt:message key="delivery_options_default__country"/></label>
                                    <input  name="shipToCountry" class="input input_width_full ui-autocomplete-input dropdown-component" autocomplete="off" id="delOpts_countrySelect"
                                       ng-model="deliveryOptionsCtrl.shipperCountry"
                                       typeahead="country.name for country in deliveryOptionsCtrl.countryList | filter : { name: $viewValue }"
                                       typeahead-min-length="2"
                                       typeahead-on-select="deliveryOptionsCtrl.onCountrySelect($item)"
                                       typeahead-template-url="shipment-options.html">
                                </div>
                            </div>
                        </div>
                        <div class="form-row field margin-top-small">
                            <div class="col-6">
                            </div>
                        </div>
                        <div class="row a-right margin-top">
                            <button id="delOpts_saveBtn" class="btn" ng-click="deliveryOptionsCtrl.saveDeliveryOptions()"><fmt:message key="save_button"/></button>
                        </div>
                    </div>
                </div>
            </form>
        </delivery-options>


        <shipment-insurance ewf-form="shipmentDefault">

        <div class="address-book-modal" ng-if="!ewfFormCtrl.rulesObtained">
            <div class="la-ball-pulse"><div></div><div></div><div></div></div>
        </div>
        <div ng-if="ewfFormCtrl.rulesObtained" class="overlay-white">

            <div class="nav right">
                <a class="nav__item btn btn_action ng-hide"
                    ng-click="shipmentInsuranceCtrl.toggleLayout()"
                    ng-hide="shipmentInsuranceCtrl.isEditing">
                        <i class="dhlicon-pencil"></i>
                        <fmt:message key="edit_button"/>
                </a>
                <a class="small"
                    ng-click="shipmentInsuranceCtrl.toggleLayout()"
                    ng-show="shipmentInsuranceCtrl.isEditing">
                        <fmt:message key="close_link"/>
                </a>
            </div>
            <form name="shipmentDefaultForm">
                <h3 class="margin-none"><fmt:message key="shipment_protection"/></h3>
                <div ng-show="shipmentInsuranceCtrl.isEditing">
                    <label class="checkbox margin-top">
                        <input type="checkbox" class="checkbox__input" id="insureShipments"
                           data-aqa-id="insureShipments"
                           ng-model="shipmentInsuranceCtrl.insureShipments">
                        <span class="label fw-bold">
                            <fmt:message key="i_typically_insure_my_shipments_label"/>
                        </span>
                    </label>
                    <div class="row margin-top">
                        <b><fmt:message key="when_i_insure_my_shipments_label"/></b><a ng-click="shipmentInsuranceCtrl.initFields()"><fmt:message key="clear_selection_link"/></a>
                        <label class="radio">
                            <input type="radio" class="radio__input" name="insureRadioGroup" value="EQUAL_DECLARED" id="defaultDeclaredValue"
                               data-aqa-id="defaultDeclaredValue"
                               ng-model="shipmentInsuranceCtrl.insureShipmentType">
                            <span class="label">
                                <fmt:message key="i_usually_enter_an_insurance_value_that_is_equal_label"/>
                            </span>
                        </label>
                        <div class="radio field-wrapper">
                            <input type="radio" class="radio__input" name="insureRadioGroup" value="CUSTOM_VALUE" id="customDeclaredValue" ng-model="shipmentInsuranceCtrl.insureShipmentType">
                            <label class="label" for="customDeclaredValue" ewf-field="insuranceAmount"><fmt:message key="i_usually_enter_an_insurance_value_of_label"/>
                                <input type="text" class="input input_small input_width_small" placeholder="0.00"
                                    ewf-input="shipmentDefault.insuranceAmount"
                                    ng-model="shipmentInsuranceCtrl.insuranceValue"
                                    ng-disabled="shipmentInsuranceCtrl.insureShipmentType != 'CUSTOM_VALUE'">
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </label>
                            <!-- TODO: get from support utility -->
                            <select class="select-units" ng-model="shipmentInsuranceCtrl.insuranceCurrency" ng-options="insuranceCurrency for insuranceCurrency in shipmentInsuranceCtrl.insuranceCurrencies">
                            </select>
                        </div>
                    </div>
                    <div class="row a-right margin-top">
                        <button class="btn" ng-disabled="!shipmentDefaultForm.$valid" ng-click="shipmentInsuranceCtrl.updateShipmentInsurance()"><fmt:message key="save_changes_button"/></button>
                    </div>
                </div>
            </form>
        </div>

    </shipment-insurance>
    
    <customs-clearance ewf-form="customsClearance">
        <div class="overlay-white">
            <div class="nav right">
                <a ng-click="customsClearanceCtrl.resetToDefault()"
                   ng-if="customsClearanceCtrl.editMode">
                    <fmt:message key="close_link"/>
                </a>
                <a class="nav__item btn btn_action dhlicon-pencil"
                   ng-click="customsClearanceCtrl.toggleEditMode()"
                   ng-if="!customsClearanceCtrl.editMode">
                    <fmt:message key="edit_button"/>
                </a>
            </div>
            <h3 class="margin-none">
                <fmt:message key="customs_clearance_default__heading"/>
            </h3>
            <div ng-if="customsClearanceCtrl.editMode">
                <div class="row margin-top">
                    <fmt:message key="customs_clearance_default__subheading"/>
                </div>
                <div class="row margin-top">
                    <b><fmt:message key="customs_clearance_default__subheading"/></b>
                    <a ng-click="customsClearanceCtrl.resetInvoiceType()">
                        <fmt:message key="customs_clearance_default__clear"/>
                    </a>
                    <div class="row m-top-small">
                        <div class="col-5">
                            <div class="radio field-wrapper">
                                <input type="radio" class="radio__input" name="customsInvoiceType" value="EXISTING" id="customsInvoice_Create"
                                   ng-model="customsClearanceCtrl.customsClearance.invoiceType">
                                <label for="customsInvoice_Create" class="label">
                                    <div>
                                        <fmt:message key="customs_clearance_default__create_invoice_label"/>
                                    </div>
                                    <span class="text_gray font-small">
                                        <fmt:message key="customs_clearance_default__create_invoice_info"/>
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div class="col-5">
                            <div class="radio field-wrapper">
                                <input type="radio" class="radio__input" name="customsInvoiceType" value="NEW" id="customsInvoice_MyOwn"
                                   ng-model="customsClearanceCtrl.customsClearance.invoiceType">
                                <label for="customsInvoice_MyOwn" class="label">
                                    <div>
                                        <fmt:message key="customs_clearance_default__own_invoice_label"/>
                                    </div>
                                    <div class="text_gray font_small">
                                        <fmt:message key="customs_clearance_default__own_invoice_info"/>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row margin-top">
                    <div class="fw-bold">
                        <fmt:message key="customs_clearance_default__purpose_label"/>
                    </div>
                    <span class="select">
                        <select
                           ng-options="(('shipment-settings.' + shipmentPurpose.name) | translate) for shipmentPurpose in customsClearanceCtrl.customsClearance.shipmentPurposes"
                           ng-model="customsClearanceCtrl.selectedShipmentPurpose">
                            <option value=""><fmt:message key="customs_clearance_select_default"/></option>
                        </select>
                    </span>
                </div>
                <div class="row margin-top">
                    <div class="fw-bold">
                        <fmt:message key="customs_clearance_default__description_label"/>
                    </div>
                    <input type="text" class="input input_width_full" placeholder="<fmt:message key="customs_clearance_default__description_placeholder"/>"
                       ng-model="customsClearanceCtrl.customsClearance.shipmentDescription">
                </div>
                <div class="row margin-top"
                   ewf-field="shipmentValue">
                    <div class="fw-bold">
                        <fmt:message key="customs_clearance_default__value_label"/>
                    </div>
                    <input type="text" class="input input_width_small" placeholder="0.00" name="shipmentValue"
                       ng-model="customsClearanceCtrl.customsClearance.shipmentValue"
                       ewf-input="customsClearance.shipmentValue"
                       ewf-validate-pattern="POSITIVE_NUMBER">
                    <select class="select-units"
                       ng-options="currency for currency in customsClearanceCtrl.customsClearance.currencies"
                       ng-model="customsClearanceCtrl.customsClearance.selectedCurrency">
                    </select>
                    <div ewf-field-errors></div>
                </div>
                <div class="row margin-top">
                    <div>
                        <fmt:message key="customs_clearance_default__incoterms_subheading"/>
                    </div>
                    <div class="fw-bold">
                        <fmt:message key="customs_clearance_default__incoterms_label"/>
                    </div>
                    <span class="select">
                        <select
                           ng-options="(('shipment-settings.' + incoterm.name) | translate) for incoterm in customsClearanceCtrl.customsClearance.incoterms"
                           ng-model="customsClearanceCtrl.selectedIncoterm">
                            <option value=""><fmt:message key="customs_clearance_select_default"/></option>
                        </select>
                        <small>
                            <a class="info">
                                <fmt:message key="customs_clearance_default__incoterms_info_link"/>
                                <span>
                                    <fmt:message key="customs_clearance_default__incoterms_info_text"/>
                                </span>
                            </a>
                        </small>
                    </span>
                </div>
                <div class="row margin-top">
                    <a href="/content/dhl/usa/en/shipment-settings.html?tab=paperlessCustomsEnrollment"><fmt:message key="customs_clearance_default__link_paperless"/></a> | <a href="/content/dhl/usa/en/shipment-settings.html?tab=customsInvoiceTemplates"><fmt:message key="customs_clearance_default__link_invoices"/></a>
                </div>
                <div class="row a-right margin-top">
                    <button class="btn"
                       ng-click="customsClearanceCtrl.updateCustomsClearance()">
                        <fmt:message key="save_changes_button"/>
                    </button>
                </div>
            </div>
        </div>
    </customs-clearance>

    <div ng-if="ewfFormCtrl.rulesObtained" class="overlay-white ng-scope" pickups-directive ewf-form="pickupsDefault">

        <div class="nav right">
            <a class="nav__item btn btn_action ng-hide" ng-click="pickupsCtrl.toggleLayout()" ng-hide="pickupsCtrl.isEditing"><i class="dhlicon-pencil"></i><fmt:message key="edit_button"/></a>
            <a class="small" ng-click="pickupsCtrl.toggleLayout()" ng-show="pickupsCtrl.isEditing"><fmt:message key="close_link"/></a>
        </div>

        <h3 class="margin-none"><fmt:message key="pickups_label"/></h3>

        <div ng-show="pickupsCtrl.isEditing">

            <div class="row margin-top">
                <label class="label fw-bold"><fmt:message key="i_would_like_my_pickup_default_to_be_label"/></label>
                <span class="select">
                    <select ng-model="pickupsCtrl.pickupSettings.pickupDefaultType">
                        <option value="NONE">-- Select One --</option>
                        <option value="YES_COURIER">Yes, I need a DHL courier pickup</option>
                        <option value="NO_SCHEDULED">No, I have a pickup scheduled already</option>
                        <option value="NO_DROP_OFF">No, I will drop off my shipment at a DHL location</option>
                    </select>
                </span>
            </div>
            <div class="row margin-top">
                <label class="label fw-bold">
                    <fmt:message key="i_typically_want_my_shipments_picked_up_at_the_following_address_label"/>
                </label>
                <div>
                    <input ng-show="pickupsCtrl.tabIsEditing" class="input" type="text" ng-model="pickupsCtrl.pickupSettings.pickupAddress"/>
                    <span ng-hide="pickupsCtrl.tabIsEditing" >{{pickupsCtrl.pickupSettings.pickupAddress}}</span>
                    <a><fmt:message key="edit_button"/></a>
                </div>
            </div>
            <div class="row margin-top">
                <label class="label fw-bold">
                    <fmt:message key="i_typically_want_my_shipments_picked_up_at_the_following_location_label"/>
                </label>
                <span class="select">
                    <select ng-model="pickupsCtrl.pickupSettings.pickupDetails.pickupLocationType">
                        <option value="NONE">-- Select One --</option>
                        <option value="FRONT_DOOR">Front Door</option>
                        <option value="BACK_DOOR">Back Door</option>
                        <option value="RECEPTION">Reception</option>
                        <option value="LOADING_DOCK">Loading Dock</option>
                        <option value="OTHER">Other</option>
                    </select>
                </span>
            </div>
            <div class="row margin-top">
                <label class="label fw-bold"><fmt:message key="i_typically_add_the_following_special_handling_instructions_label"/></label>
                <textarea ng-model="pickupsCtrl.pickupSettings.pickupDetails.instructions" class="textarea textarea_width_full"></textarea>
            </div>
            <div class="row margin-top">
                <label class="label fw-bold"><fmt:message key="i_typically_want_my_shipments_picked_up_during_the_following_hours_label"/></label>
                <div class="overlay-grey">
                    <div class="row">
                        <div class="a-center">
                            <input type="text" id="range-slider" name="example_name" value="" />
                            <strong id="earliest-pickup"><fmt:message key="earliest_pickup_label"/></strong>
                            <strong id="latest-pickup"><fmt:message key="latest_pickup_label"/></strong>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row a-right margin-top">
                <button ng-click="pickupsCtrl.toggleLayout()" class="btn"><fmt:message key="save_changes_button"/></button>
            </div>
        </div>
    </div>

    <return-shipments>
        <div class="overlay-white">
            <div class="nav right">
                <a class="nav__item btn btn_action ng-hide"
                    ng-click="returnShipmentsCtrl.toggleLayout()"
                    ng-hide="returnShipmentsCtrl.isEditing">
                    <i class="dhlicon-pencil"></i>
                    <fmt:message key="edit_button"/>
                </a>
                <a class="small"
                    ng-click="returnShipmentsCtrl.toggleLayout()"
                    ng-show="returnShipmentsCtrl.isEditing">
                    <fmt:message key="close_link"/>
                </a>
            </div>
            <h3 class="margin-none"><fmt:message key="return_shipments_label"/></h3>
            <div ng-show="returnShipmentsCtrl.isEditing">
                <div class="row margin-top">
                    <label class="label fw-bold">
                        <fmt:message key="ask_me_whether_i_need_a_return_shipping_label"/>
                    </label>
                    <span class="select">
                        <select ng-model="returnShipmentsCtrl.returnLabelType"
                            ng-options="shippingLabel.id as shippingLabel.data for shippingLabel in returnShipmentsCtrl.returnShippingLabels">
                        </select>
                    </span>
                </div>
                <div ng-show="returnShipmentsCtrl.returnLabelType === 'SAME_TIME'  || returnShipmentsCtrl.returnLabelType === 'AFTER_PRINTED'">
                    <div class="row margin-top">
                        <label class="label fw-bold">
                                <fmt:message key="i_typically_send_the_return_shipping_label_to_the_recipient_label"/>
                        </label>
                        <span class="select">
                            <select ng-model="returnShipmentsCtrl.returnLabelSendType"
                                ng-options="returnLabelSendType.id as returnLabelSendType.data for returnLabelSendType in returnShipmentsCtrl.returnLabelSendTypes">
                            </select>
                        </span>
                    </div>
                    <div class="row margin-top">
                        <label class="label fw-bold">
                            <fmt:message key="i_typically_include_the_following_instructions_with_my_return_shipments_label"/>
                        </label>
                        <textarea class="textarea textarea_width_full" ng-model="returnShipmentsCtrl.instructions"></textarea>
                    </div>
                </div>
                <div class="row a-right margin-top">
                    <button class="btn"
                        ng-click="returnShipmentsCtrl.updateReturnShipments()">
                        <fmt:message key="save_changes_button"/>
                    </button>
                </div>
            </div>
        </div>
    </return-shipments>

    <saving-shipments>
        <div class="overlay-white">
            <div class="nav right">
                <a class="nav__item btn btn_action"
                   ng-click="savingShipmentsController.toggleLayout()"
                   ng-hide="savingShipmentsController.isEditing">
                    <i class="dhlicon-pencil"></i><fmt:message key="edit_button"/>
                </a>
                <a class="small"
                   ng-click="savingShipmentsController.exitFromEditing()"
                   ng-show="savingShipmentsController.isEditing">
                    <fmt:message key="close_link"/>
                </a>
            </div>
            <h3 class="margin-none"><fmt:message key="saving_shipments_label"/></h3>
            <div ng-show="savingShipmentsController.isEditing">
                <div class="row margin-top">
                    <fmt:message key="when_you_have_an_incomplete_shipment_label"/>
                </div>
                <div class="row margin-top">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input " id="askSaveShip"
                           ng-model="savingShipmentsController.saveIncompleteSavings"
                           data-aqa-id="askSaveShip">
                        <span class="label fw-bold">
                            <fmt:message key="ask_me_if_i_would_like_to_save_incomplete_shipments_label"/>
                        </span>
                    </label>
                </div>
                <div class="row a-right margin-top">
                    <button class="btn" ng-click="savingShipmentsController.updateDefaultSavingShipment()"><fmt:message key="save_changes_button"/></button>
                </div>
            </div>
        </div>
    </saving-shipments>

    <assigning-shipments>
        <div class="overlay-white">
            <div class="nav right">
                <a class="nav__item btn btn_action dhlicon-pencil"
                   ng-hide="assigningShipmentsCtrl.isEditMode()"
                   ng-click="assigningShipmentsCtrl.setEditMode()">
                    <fmt:message key="edit_button"/>
                </a>
            </div>
            <h3 class="margin-none"><fmt:message key="assign_ship_title"/></h3>
            <div ng-show="assigningShipmentsCtrl.isEditMode()"
               ewf-form="assignShipments">
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="allowShipmentAssigning"
                           data-aqa-id="allowShipmentAssigning"
                           ng-model="assigningShipmentsCtrl.assigningOptions.allowShipmentAssigning">
                        <span class="label">
                            <fmt:message key="assign_ship_allow_shipment_assigning"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top fw-bold"><fmt:message key="assign_ship_when_assigning"/></div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="hideAccountNumber"
                           data-aqa-id="hideAccountNumber"
                           ng-model="assigningShipmentsCtrl.assigningOptions.hideAccountNumber">
                        <span class="label">
                            <fmt:message key="assign_ship_hide_account"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="hideAccountRates"
                           data-aqa-id="hideAccountRates"
                           ng-model="assigningShipmentsCtrl.assigningOptions.hideAccountRates">
                        <span class="label">
                            <fmt:message key="assign_ship_hide_rates"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="requireAssigneeLogin"
                           data-aqa-id="requireAssigneeLogin"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.requireAssigneeLogin">
                        <span class="label">
                            <fmt:message key="assign_ship_require_login"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="assigneeMayEditAddress"
                           data-aqa-id="assigneeMayEditAddress"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.assigneeMayEditAddress">
                        <span class="label">
                            <fmt:message key="assign_ship_assignee_edit_address"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="requireChangedShipmentApprove"
                           data-aqa-id="requireChangedShipmentApprove"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.requireChangedShipmentApprove">
                        <span class="label">
                            <fmt:message key="assign_ship_shipment_approve"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top">
                    <div class="fw-bold">
                        <fmt:message key="assign_ship_follow_instructions"/>
                    </div>
                    <textarea name="assignShip_Inst" class="textarea textarea_width_full"
                       noresize="noresize"
                       data-aqa-id="assignInstructions"
                       ng-model="assigningShipmentsCtrl.assigningOptions.assignInstructions">
                    </textarea>
                </div>
                <div class="row margin-top">
                    <span class="fw-bold"><fmt:message key="assign_ship_apply_restrictions"/></span>
                </div>
                <div class="row margin-top-small"
                   ewf-field="restrictMaxDeclaredValue">
                    <div><fmt:message key="assign_ship_declared_value"/></div>
                    <div><input type="text" class="input input_small input_width_small"
                       data-aqa-id="restrictMaxDeclaredValue"
                       ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.restrictMaxDeclaredValue"
                       ewf-input="assignShipments.restrictMaxDeclaredValue"
                       ewf-validate-pattern="POSITIVE_NUMBER_TWO_DECIMALS">
                    </div>
                    <div ewf-field-errors></div>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="restrictEditContentDescription"
                           data-aqa-id="restrictEditContentDescription"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.restrictEditContentDescription">
                        <span class="label">
                            <fmt:message key="assign_ship_desc_cannot_be_eddited"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="allowShipmentInsurance"
                           data-aqa-id="allowShipmentInsurance"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.allowShipmentInsurance">
                        <span class="label">
                            <fmt:message key="assign_ship_insurance_can_be_added"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small"
                   ewf-field="restrictMaxInsuredValue">
                    <div><fmt:message key="assign_ship_insured_value"/></div>
                    <input type="text" class="input input_small input_width_small"
                       data-aqa-id="restrictMaxInsuredValue"
                       ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.restrictMaxInsuredValue"
                       ewf-input="assignShipments.restrictMaxInsuredValue"
                       ewf-validate-pattern="POSITIVE_NUMBER_TWO_DECIMALS">
                    <div ewf-field-errors></div>
                </div>
                <div class="row margin-top-small"
                   ewf-field="restrictMaxPiecesNumber">
                    <div><fmt:message key="assign_ship_max_num"/></div>
                    <div><input type="text" class="input input_small input_width_small"
                       data-aqa-id="restrictMaxPiecesNumber"
                       ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.restrictMaxPiecesNumber"
                       ewf-input="assignShipments.restrictMaxPiecesNumber"
                       ewf-validate-pattern="NATURAL_NUMBER">
                    </div>
                    <div ewf-field-errors></div>
                </div>
                <div class="row margin-top-small" ewf-field="restrictMaxPieceWeight">
                    <div><fmt:message key="assign_ship_each_package"/></div>
                    <div><input type="text" class="input input_small input_width_small"
                       data-aqa-id="restrictMaxPieceWeight"
                       ng-model="assigningShipmentsCtrl.assigningOptions.assignmentRestrictions.restrictMaxPieceWeight"
                       ewf-input="assignShipments.restrictMaxPieceWeight"
                       ewf-validate-pattern="POSITIVE_NUMBER_ONE_DECIMAL">
                    </div>
                    <div ewf-field-errors></div>
                </div>
                <div class="row margin-top fw-bold">
                    <fmt:message key="assign_ship_my_notifications"/>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyNoActionTaken"
                           data-aqa-id="notifyNoActionTaken"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfNoActionTaken">
                        <span class="label">
                            <fmt:message key="assign_ship_notify_me"/>
                        </span>
                    </label>
                </div>
                <div class="row">
                    <div class="col-6">
                        <div class="row">
                            <span class="select select_width_half">
                                <select data-aqa-id="maxNoActionTakenPeriodKey"
                                   ng-options="notifyPeriod.key as notifyPeriod.name for notifyPeriod in assigningShipmentsCtrl.notificationOptions.inactivityAssignedShipmentInterval"
                                   ng-disabled="!assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfNoActionTaken"
                                   ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.maxNoActionTakenPeriodKey">
                                </select>
                            </span>
                        </div>
                        <div class="row margin-top-small">
                            <div><fmt:message key="assign_ship_send_me"/></div>
                            <span class="select select_width_half">
                                <select data-aqa-id="sendRemindEveryPeriodKey"
                                   ng-options="notifyPeriod.key as notifyPeriod.name for notifyPeriod in assigningShipmentsCtrl.notificationOptions.notifyAssignerInterval"
                                   ng-disabled="!assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfNoActionTaken"
                                   ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.sendRemindEveryPeriodKey">
                                </select>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyIfShipmentExpired"
                           data-aqa-id="notifyIfShipmentExpired"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfShipmentExpired">
                        <span class="label">
                            <fmt:message key="assign_ship_not_complete"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyIfShipmentCompleted"
                           data-aqa-id="notifyIfShipmentCompleted"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfShipmentCompleted">
                        <span class="label">
                            <fmt:message key="assign_ship_is_complete"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyIfPickupRequested"
                           data-aqa-id="notifyIfPickupRequested"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfPickupRequested">
                        <span class="label">
                            <fmt:message key="assign_ship_pickup"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyIfShipmentPickedUp"
                           data-aqa-id="notifyIfShipmentPickedUp"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfShipmentPickedUp">
                        <span class="label">
                            <fmt:message key="assign_ship_picked"/>
                        </span>
                    </label>
                </div>
                <div class="row margin-top-small">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="notifyIfShipmentDeclined"
                           data-aqa-id="notifyIfShipmentDeclined"
                           ng-model="assigningShipmentsCtrl.assigningOptions.assignmentNotifications.notifyIfShipmentDeclined">
                        <span class="label">
                            <fmt:message key="assign_ship_declined"/>
                        </span>
                    </label>
                </div>

                <div class="row a-right margin-top">
                    <a class="m-right-small"
                       data-aqa-id="cancelButton"
                       ng-click="assigningShipmentsCtrl.cancelChanges()">
                        <fmt:message key="cancel_button"/>
                    </a>
                    <button class="btn"
                       data-aqa-id="saveButton"
                       ng-click="assigningShipmentsCtrl.applyChanges()">
                        <fmt:message key="save_button"/>
                    </button>
                </div>
            </div>
        </div>
    </assigning-shipments>

    <ewf-som-currency>
        <div class="overlay-white">
            <div class="nav right">
                <a class="nav__item btn btn_action"
                   ng-click="somCurrencyCtrl.isEditing = true"
                   ng-hide="somCurrencyCtrl.isEditing">
                    <i class="dhlicon-pencil"></i>
                    <fmt:message key="edit_button"/>
                </a>
                <a class="small"
                   ng-click="somCurrencyCtrl.toggleLayout()"
                   ng-show="somCurrencyCtrl.isEditing">
                    <fmt:message key="close_link"/>
                </a>
            </div>

            <h3 class="margin-none"><fmt:message key="som_currency_label"/></h3>
            <div ng-show="somCurrencyCtrl.isEditing">

                <div class="alert alert_error" ng-if="somCurrencyCtrl.serverErrorMessage" nls-bind
                   nls="{{somCurrencyCtrl.serverErrorMessage}}">
                </div>

                <div class="row margin-top">
                    <label class="label fw-bold" for="default_som">
                        <fmt:message key="default_my_som_to"/>
                    </label>

                    <div class="select select_width_half" ng-if="somCurrencyCtrl.isSomList()">
                        <select id="default_som" ng-model="somCurrencyCtrl.defaultSomAndCurrency.som">
                            <option value="{{som.key}}"
                              ng-repeat="som in somCurrencyCtrl.defaultSomAndCurrency.somList"
                              ng-selected="som.key === somCurrencyCtrl.defaultSomAndCurrency.som"
                              nls="{{som.value}}">
                        </select>
                    </div>
                    <input value="{{somCurrencyCtrl.defaultSomAndCurrency.som}}" id="default_som" disabled="disabled"
                       ng-if="!somCurrencyCtrl.isSomList()">
                </div>
                <div class="row margin-top">
                    <label class="label fw-bold" for="default-declared-currency">
                        <fmt:message key="default_my_declared_currency_to"/>
                    </label>

                    <div class="select select_width_half">
                        <select id="default-declared-currency"
                           ng-model="somCurrencyCtrl.defaultSomAndCurrency.defaultCurrency"
                           ng-options="currency.key as currency.value for currency in somCurrencyCtrl.defaultSomAndCurrency.defaultCurrencyList">
                        </select>
                    </div>
                </div>
                 <div class="row margin-top">
                    <label class="label fw-bold" for="default-insurance-currency">
                        <fmt:message key="default_my_insurance_currency_to"/>
                    </label>

                    <div class="select select_width_half">
                        <select id="default-insurance-currency"
                           ng-model="somCurrencyCtrl.defaultSomAndCurrency.defaultInsuranceCurrency"
                           ng-options="currency.key as currency.value for currency in somCurrencyCtrl.defaultSomAndCurrency.defaultInsuranceCurrencyList">
                        </select>
                    </div>
                 </div>
                <div class="row a-right margin-top">
                    <button class="btn" ng-click="somCurrencyCtrl.updateDefaultSomAndCurrency()">
                        <fmt:message key="save_changes_button"/>
                    </button>
                </div>
            </div>
        </div>
    </ewf-som-currency>

    <address-entry>
        <div class="overlay-white">
            <div class="nav right">
                <button class="nav__item btn btn_action dhlicon-pencil" id="addressEntryEdit"
                   ng-click="addressEntryCtrl.toggleLayout()"
                   ng-show="!addressEntryCtrl.isEditing">
                    <fmt:message key="edit_button"/>
                </button>
                <a href="" class="small" id="addressEntryClose"
                   ng-click="addressEntryCtrl.restoreDefaults(); addressEntryCtrl.toggleLayout()"
                   ng-show="addressEntryCtrl.isEditing">
                    <fmt:message key="close_link"/>
                </a>
            </div>
            <h3 class="margin-none">
                <fmt:message key="address_entry__title"/>
            </h3>
            <div ng-if="addressEntryCtrl.isEditing">
                <div class="row margin-top">
                    <label class="checkbox">
                        <input type="checkbox" class="checkbox__input" id="addressEntryDefaultResidential"
                           ng-model="addressEntryCtrl.residentialDefaultCache">
                        <span class="label" for="addressEntryDefaultResidential"><fmt:message key="address_entry__label"/></span>
                    </label>
                </div>
                <div class="row a-right margin-top">
                    <button class="btn" id="addressEntrySave"
                       ng-click="addressEntryCtrl.updateResidentialDefault(); addressEntryCtrl.toggleLayout()">
                        <fmt:message key="save_changes_button"/>
                    </button>
                </div>
            </div>
        </div>
    </address-entry>

</div>
</div>
