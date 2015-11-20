<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-shipment-cost,
            payment-products,
            ewf-address"
        paths="components/shipment/shipment-cost/ewf-shipment-cost-directive,
            components/shipment/shipment-cost/payment-products/payment-products-directive,
            directives/ewf-address/ewf-address-cq-directive,
            directives/ewf-validate/ewf-validate-email-directive" />

<script type="text/ng-template" id="address-item.html">
    <div class="typeahead-group-header" ng-if="match.model.firstInGroup">{{match.model.group}}</div>
    <a>
        <span bind-html-unsafe="match.model.fullAddress | typeaheadHighlight:query"></span>
    </a>
</script>
<script type="text/ng-template" id="address-country.html">
    <a>
        <span>{{match.model.name}}<i class="flag flag_{{match.model.code2}}"></i></span>
    </a>
</script>
<script type="text/ng-template" id="cityTypeaheadTemplate.html">
    <a>
        <span>{{match.model.postalCode}}</span>
        <span bind-html-unsafe="(match.label | typeaheadHighlight:query) + ','"></span>
        <span>{{match.model.stateName}}</span>
    </a>
</script>
<script type="text/ng-template" id="zipTypeaheadTemplate.html">
    <a>
        <span bind-html-unsafe="match.label | typeaheadHighlight:query"></span>
        <span>{{match.model.city}}, </span>
        <span>{{match.model.stateName}}</span>
    </a>
</script>
<ewf-shipment-cost>
<section id="section_cost" class="area"
   ng-cloak
   ng-if="shipmentCostCtrl.initialized">
    <header class="area__header">
        <h2 class="area__title"><fmt:message key="shipment_cost_title"/></h2>
    </header>

    <div class="area__content">
        <div class="row">
            <div class="col-9">
                <div class="row">
                    <div class="col-6">
                        <p>
                            <span class="fw-bold">{{shipmentCostCtrl.product.name}}</span>
                            <span class="block">
                                {{shipmentCostCtrl.product.deliveryDateShort}}
                                -
                                {{shipmentCostCtrl.product.deliveredBy}}
                            </span>
                        </p>
                        <div ng-if="shipmentCostCtrl.product.volumetricWeight">
                            <b><fmt:message key="shipment_cost_volumetric_weight"/></b>
                            <a href="" class="info">
                                <div><fmt:message key="shipment_cost_volumetric_weight_tooltip"/></div>
                            </a>
                            <span>- {{shipmentCostCtrl.product.volumetricWeight}}</span>
                        </div>
                    </div>

                    <div class="col-6" id="product-cost-breakdown">
                        <table class="table table_summary">
                            <tr ng-repeat="detail in shipmentCostCtrl.product.costDetails">
                                <td>{{detail.name}}:</td>
                                <td class="a-right"><span>$</span></td>
                                <td class="a-right">{{detail.value}}</td>
                            </tr>
                            <tr>
                                <th class="a-left"><fmt:message key="details_total"/></th>
                                <th class="a-right"><span>$</span></th>
                                <th class="table__total a-right">{{shipmentCostCtrl.product.costTotal}}</th>
                            </tr>
                        </table>
                        <br>
                        <form name="promoCodes">
                            <div class="field form-row" ng-if="shipmentCostCtrl.isPromoCodeVisible()">
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" value="yes" id="showPromoCode" class="checkbox__input"
                                       data-aqa-id="showPromoCode"
                                       ng-model="shipmentCostCtrl.promoCodeShown">
                                    <span class="label">
                                        <fmt:message key="shipment_cost_promotion_code_message"/>
                                    </span>
                                </label>
                                <div class="form-row" ng-if="shipmentCostCtrl.promoCodeShown">
                                    <i class="dhlicon-coupon"></i>
                                    <span ng-if="!shipmentCostCtrl.promoCodeApplied">
                                        <input type="text" name="promoCode" id="promoCode" class="input input_small"
                                           placeholder="<fmt:message key="shipment_cost_promotion_code.placeholder"/>"
                                           ng-model="shipmentCostCtrl.promoCode">
                                        <a class="btn btn_small" ng-click="shipmentCostCtrl.applyPromoCode()"
                                           ng-hide="shipmentCostCtrl.promoCodeApplied">
                                            <fmt:message key="shipment_cost_apply"/>
                                        </a>
                                    </span>
                                    <span ng-if="shipmentCostCtrl.promoCodeApplied">
                                        <span ng-bind-html="shipmentCostCtrl.promoAppliedMessage"></span>
                                        <a class="btn btn_small btn_action" ng-click="shipmentCostCtrl.editPromoCode()">
                                            <i class="dhlicon-pencil"></i><fmt:message key="edit"/>
                                        </a>
                                    </span>
                                    <span class="warning-text"
                                       ng-if="!shipmentCostCtrl.promoCodeValid">
                                        <fmt:message key="shipment_cost_promotion_code_error"/></span>
                                </div>
                            </div>

                            <div class="field form-row" ng-if="shipmentCostCtrl.isRewardCardVisible()">
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" value="yes" id="showNectarCode" class="checkbox__input"
                                       data-aqa-id="showNectarCode"
                                       ng-model="shipmentCostCtrl.rewardCardShown">
                                    <span class="label">
                                        <fmt:message key="shipment_cost_reward_card_message"/>
                                    </span>
                                </label>
                                <div class="form-row" ng-if="shipmentCostCtrl.rewardCardShown">
                                    <table width="100%" ng-if="!shipmentCostCtrl.rewardCardApplied">
                                        <tbody>
                                            <tr>
                                                <td class="a-right">
                                                    <label for="nectarCardNum">98263000</label> &nbsp;
                                                </td>
                                                <td>
                                                    <input type="text" name="nectarCardNum" id="nectarCardNum"
                                                       class="input input_small"
                                                       placeholder="00000000 00X"
                                                       ng-model="shipmentCostCtrl.rewardCard.rewardCard"
                                                       ng-blur="shipmentCostCtrl.onRewardCardNumberChanges()"
                                                       required>
                                                </td>
                                                <td class="a-center">
                                                    <a ng-click="shipmentCostCtrl.saveRewardCardNumber()"
                                                       ng-if="shipmentCostCtrl.isSaveRewardCardOptionShown">
                                                        <small><fmt:message key="shipment_cost_reward_card_save_to_profile"/></small>
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="a-right">
                                                    <label>
                                                        <i class="dhlicon-coupon"></i>
                                                        <fmt:message key="shipment_cost_promotion_code_short"/>
                                                    </label> &nbsp;
                                                </td>
                                                <td>
                                                    <input type="text" name="nectarCode" id="nectarCode" class="input input_small"
                                                       ng-model="shipmentCostCtrl.rewardCard.promoCode">
                                                </td>
                                                <td class="a-center">
                                                    <a class="btn btn_small" ng-click="shipmentCostCtrl.applyRewardCard()">
                                                        <fmt:message key="shipment_cost_apply"/>
                                                    </a>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="warning-text"
                                        ng-if="shipmentCostCtrl.rewardCardNumberInvalid">
                                        <fmt:message key="shipment_cost_reward_card_number_error"/></div>
                                    <div class="warning-text" ng-if="shipmentCostCtrl.rewardCardPromoCodeInvalid">
                                        <fmt:message key="shipment_cost_reward_card_promo_code_error"/></div>
                                    <span ng-if="shipmentCostCtrl.rewardCardApplied">
                                        <span ng-bind-html="shipmentCostCtrl.rewardAppliedMessage"></span>
                                        <a class="btn btn_small btn_action" ng-click="shipmentCostCtrl.editRewardCard()">
                                            <i class="dhlicon-pencil"></i><fmt:message key="edit"/>
                                        </a>
                                    </span>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                <!--
                <h3>Terms and Conditions</h3>

                <p>
                    By clicking on <b>Agree and Continue</b> I am agreeing to <a>DHL's Terms and Conditions</a>
                    and declare that this shipment does not include any <a href="#">prohibited items</a>
                </p>
                -->
            </div>

            <div class="col-3" ng-if="shipmentCostCtrl.isUpgradeMessageVisible">
                <div class="callout callout_carat_left">
                    <h3 class="callout__title h3">{{shipmentCostCtrl.upgradeMessage}}</h3>
                    <div class="callout__content">
                        <button type="button" class="btn right"
                           nls="shipment.shipment_cost_upgrade_now"
                           ng-click="shipmentCostCtrl.upgradeProduct()">
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="row" ng-if="shipmentCostCtrl.isCreditCardPayment()">
            <div class="col-9">
                <div class="overlay-grey">
                    <h2 class="margin-top-none"><fmt:message key="shipment_cost_credit_payment_title"/></h2>
                    <div class="row">
                        <div class="col-4">
                            <payment-products
                               ng-model="shipmentCostCtrl.paymentProduct"
                               products="shipmentCostCtrl.paymentProducts"></payment-products>
                        </div>
                    </div>
                    <div class="alert alert_warning" ng-bind="shipmentCostCtrl.getCreditBufferNotification()"></div>
                    <label class="checkbox">
                        <input type="checkbox" id="edit_billing_address" class="checkbox__input"
                           ng-model="shipmentCostCtrl.billingAddress.addressDifferent"
                           data-aqa-id="edit_billing_address">
                        <span class="label">
                            <fmt:message key="shipment_cost_credit_payment_billing_address_label" />
                        </span>
                    </label>
                    <ewf-address address="shipmentCostCtrl.billingAddress"
                       ng-if="shipmentCostCtrl.billingAddress.addressDifferent">
                        <div id="modals" class="visible" ng-cloak="" ng-if="addressCtrl.showPopup">
                            <div id="modal-bg"></div>
                            <div class="modal full-width visible" id="modal_address-book">
                                <div>
                                    <cq:include path="billingAddressBook" resourceType="dhl/components/addressbook/dhl-address-book" />
                                </div>
                                <a class="x-button close-modal" ng-click="addressCtrl.showPopup = false"></a>
                            </div>
                        </div>
                        <ng-form novalidate name="shipmentCostCtrl.billingAddressForm" ewf-form="addressDefinition">
                            <div class="col-6">
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.name" ewf-search="{searchType: 'ordered', fieldName: 'name'}">
                                    <label for="billing_name" class="label"><fmt:message key="address__name_label"/></label>
                                    <input id="billing_name" type="text" class="input input_width_full"
                                       ng-model="addressCtrl.attributes.address.name"
                                       ewf-input="billingAddress.name"
                                       ewf-validate-required />
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                    <button type="button" class="btn btn_addon btn_animate" ng-click="addressCtrl.showPopup = true">
                                        <span class="btn__text"><fmt:message key="address__address_book_button"/></span><i class="dhlicon-address-book"></i>
                                    </button>
                                </div>
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.company">
                                    <label for="billing_company" class="label"><fmt:message key="address__company_label"/></label>
                                    <input id="billing_company" type="text" class="input input_width_full"
                                       ng-model="addressCtrl.attributes.address.company"
                                       ewf-input="billingAddress.company"
                                       ewf-validate-required />
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.email">
                                    <label for="billing_email" class="label"><fmt:message key="address_details.email"/></label>
                                    <input id="billing_email" type="text" class="input input_width_full"
                                       ng-model="addressCtrl.attributes.address.email"
                                       ewf-input="billingAddress.email"
                                       ewf-validate-required
                                       ewf-validate-email />
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                                <div class="row">
                                    <ewf-phone phone="shipmentCostCtrl.billingAddress.phone">
                                        <div class="col-3"
                                           ewf-field="creditCardPaymentInfo.countryCode">
                                            <label for="countryCode" class="label"><fmt:message key="phone__country_code_label"/></label>

                                            <div class="field field_with-mark phone-autocomplete">
                                                <i class="phone-autocomplete__flag flag flag_small"></i>
                                                <input id="countryCode" type="text" class="input input_width_full"
                                                   ewf-input="phoneFieldForm.countryCode"
                                                   ng-model="phoneCtrl.attributes.phone.phoneDetails.phoneCountryCode"
                                                   ewf-validate-pattern="{{phoneCtrl.patterns.numericSpecialChars}}">
                                                <div ewf-field-errors></div>
                                            </div>
                                        </div>
                                        <div class="field field_with-mark col-9"
                                           ewf-field="creditCardPaymentInfo.phoneNumber">
                                            <label for="phone" class="label"><fmt:message key="phone__label"/></label>
                                            <input type="text" class="input input_width_full" name="phone" id="phone"
                                               ewf-validate-pattern="{{phoneCtrl.patterns.formatted}}"
                                               ewf-validate-pattern="{{phoneCtrl.patterns.numeric}}"
                                               ng-model="phoneCtrl.attributes.phone.phoneDetails.phoneNumber"
                                               ewf-input="phoneFieldForm.phone"
                                               ewf-validate-required>
                                            <span class="validation-mark"></span>
                                            <div ewf-field-errors></div>
                                        </div>
                                    </ewf-phone>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.address">
                                    <label for="billing_address" class="label"><fmt:message key="address__address_label"/></label>
                                    <input type="text" class="input input_width_full" name="address" id="billing_address"
                                       ng-model="addressCtrl.attributes.address.addressDetails.addrLine1"
                                       typeahead="address as address.name for address in addressCtrl.getAddresses($viewValue)"
                                       typeahead-template-url="address-item.html"
                                       typeahead-min-length="2"
                                       typeahead-on-select="addressCtrl.addressSelected($item, $model, $label)"
                                       ewf-input="billingAddress.address"
                                       ewf-validate-required>
                                        <span class="validation-mark"></span>
                                        <div ewf-field-errors></div>
                                </div>
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.address2" ng-if="!ewfFormCtrl.hideRules.address2">
                                    <label for="billing_address2" class="label"><fmt:message key="address__address2_label"/></label>
                                    <input type="text" class="input input_width_full" id="billing_address2" maxlength="35"
                                       ng-model="addressCtrl.attributes.address.addressDetails.addrLine2"
                                       ewf-input="billingAddress.address2">
                                    <div ewf-field-errors></div>
                                </div>
                                <div class="field-wrapper" ewf-field="creditCardPaymentInfo.country">
                                    <label for="billing_country" class="label"><fmt:message key="address__country_label"/></label>
                                    <input id="billing_country" class="input input_width_full dropdown-component" type="text" autocomplete="off"
                                       ng-model="addressCtrl.attributes.address.addressDetails.countryName"
                                       typeahead="country.name for country in addressCtrl.attributes.address.countries | filter : { name: $viewValue }"
                                       typeahead-template-url="address-country.html"
                                       typeahead-min-length="2"
                                       typeahead-on-select="addressCtrl.onCountrySelect($item, ewfFormCtrl)"
                                       ewf-input="billingAddress.country"
                                       ewf-validate-required>
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                                <div class="row">
                                    <div class="field-wrapper col-3">
                                        <div ng-if="!ewfFormCtrl.hideRules.zip"
                                           ewf-field="creditCardPaymentInfo.zip">
                                            <label for="billing_zip" class="label"><fmt:message key="address__zip_code_label"/></label>
                                            <input type="text" class="input input_width_full" id="billing_zip"
                                               ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                                               ewf-input="billingAddress.zip"
                                               typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                                               typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                                               typeahead-template-url="zipTypeaheadTemplate.html"
                                               ewf-validate-required>
                                            <span class="validation-mark"></span>
                                            <div ewf-field-errors></div>
                                        </div>
                                        <div ng-if="!ewfFormCtrl.hideRules.code"
                                           ewf-field="creditCardPaymentInfo.code">
                                            <label for="billing_postal" class="label"><fmt:message key="address__postal_code_label"/></label>
                                            <input type="text" class="input input_width_full" id="billing_postal"
                                               ng-model="addressCtrl.attributes.address.addressDetails.zipOrPostCode"
                                               ewf-input="billingAddress.code"
                                               typeahead="zip as zip.postalCode for zip in addressCtrl.getZipCodes($viewValue)"
                                               typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                                               typeahead-template-url="zipTypeaheadTemplate.html"
                                               ewf-validate-required>
                                            <span class="validation-mark"></span>
                                            <div ewf-field-errors></div>
                                        </div>
                                    </div>
                                    <div class="field-wrapper col-5" ewf-field="creditCardPaymentInfo.city" ng-if="!ewfFormCtrl.hideRules.city">
                                        <label for="billing_city" class="label"><fmt:message key="address__city_label"/></label>
                                        <input type="text" class="input input_width_full" id="billing_city"
                                           ng-model="addressCtrl.attributes.address.addressDetails.city"
                                           ewf-validate-required
                                           ewf-input="billingAddress.city"
                                           typeahead="city as city.city for city in addressCtrl.getCities($viewValue)"
                                           typeahead-on-select="addressCtrl.zipCodeOrCitySelected($item)"
                                           typeahead-template-url="cityTypeaheadTemplate.html">
                                        <span class="validation-mark"></span>
                                        <div ewf-field-errors></div>
                                    </div>
                                    <div class="field-wrapper col-4">
                                        <div ewf-field="creditCardPaymentInfo.state" ng-if="!ewfFormCtrl.hideRules.state">
                                            <label for="billing_state" class="label"><fmt:message key="address__state_label"/></label>
                                            <input type="text" class="input input_width_full" id="billing_state"
                                               ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                                               ewf-input="billingAddress.state"
                                               ewf-validate-required>
                                            <span class="validation-mark"></span>
                                            <div ewf-field-errors></div>
                                        </div>
                                        <div class="field-wrapper" ewf-field="creditCardPaymentInfo.province" ng-if="!ewfFormCtrl.hideRules.province">
                                            <label for="billing_province" class="label"><fmt:message key="address__province_label"/></label>
                                            <input type="text" class="input input_width_full" id="billing_province"
                                               ng-model="addressCtrl.attributes.address.addressDetails.stateOrProvince"
                                               ewf-input="billingAddress.province"
                                               ewf-validate-required>
                                            <span class="validation-mark"></span>
                                            <div ewf-field-errors></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ng-form>
                    </ewf-address>
                </div>
            </div>
        </div>
    </div>

    <footer class="area__footer a-right">
        <a class="btn btn_success"
           ng-bind="shipmentCostCtrl.getCompleteShipmentLabel()"
           ewf-click="shipmentCostCtrl.completeShipment()">
        </a>
    </footer>
</section>

</ewf-shipment-cost>
