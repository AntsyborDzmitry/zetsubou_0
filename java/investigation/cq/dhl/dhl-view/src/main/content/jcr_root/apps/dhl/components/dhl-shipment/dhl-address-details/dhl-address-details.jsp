<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent elements="ewf-address-details"
        paths="components/shipment/address-details/address-details-directive,
            directives/ewf-click/ewf-click-directive,
            directives/ewf-validate/ewf-validate-email-directive"/>

<ewf-address-details>
<div ng-cloak ng-if="addressDetailsCtrl.initialized">
    <div class="row">
        <div class="area-wrap" ng-if="addressDetailsCtrl.editModeActive">
            <section class="area">
                <div class="row">
                <%--UPDATE BUTTON--%>
                    <div class='safe-for-later' ng-if="(addressDetailsCtrl.safingShipment && (!addressDetailsCtrl.fromShowCreateButton || !addressDetailsCtrl.toShowCreateButton))">
                        <ul class="menu-bar__items">
                            <li class="menu-bar__item"><a class="btn btn_action btn_action_white"
                               ng-click="addressDetailsCtrl.clearAddressFrom();addressDetailsCtrl.clearAddressTo()">
                                <i class="dhlicon-cancel"></i><fmt:message key="toolbar_cancel"/></a>
                            </li>
                            <li class="menu-bar__item" accessible-for="expert"><!-- ngIf: hasAccess --></li>
                            <li class="menu-bar__item"><a class="btn btn_success btn_small"><i class="dhlicon-save"></i><fmt:message key="toolbar_save_for_later"/></a></li>
                        </ul>
                    </div>
                    <!-- TODO: Check whether we need other rules here on page -->
                    <form name="contactDetails" ewf-form="contactDetails" novalidate>
                        <div class="row">
                            <div class="col-5">
                                <cq:include path="fromAddress" resourceType="dhl/components/addressbook/dhl-address"/>
                                <div class="field-wrapper"
                                   ewf-field="fromEmail">
                                    <label for="fromEmail" class="label"><fmt:message key="address_details.email"/></label>
                                    <input id="fromEmail" class="input input_width_full"
                                       type="text"
                                       ng-model="addressDetailsCtrl.fromContactFields.email"
                                       ewf-input="contactDetails.fromEmail"
                                       ewf-validate-required
                                       ewf-validate-email
                                       required>
                                     <span class="validation-mark"></span>
                                     <div ewf-field-errors></div>
                                </div>
                                <cq:include path="fromPhone" resourceType="dhl/components/addressbook/dhl-phone-component"/>
                                <div class="row">
                                    <div class="field-wrapper"
                                       ewf-field>
                                        <label for="fromVatTax" class="label"><fmt:message key="address_details_vat_tax"/></label>
                                        <input id="fromVatTax" class="input input_width_full" type="text" name="fromVatTax"
                                           ng-model="addressDetailsCtrl.fromContactFields.vatTax"
                                           ewf-input>
                                    </div>
                                </div>
                                 <label class="checkbox"
                                    ng-if="addressDetailsCtrl.fromContactFields.addrLine1">
                                    <input type="checkbox" id="checkbox_residentialAddressfrom" class="checkbox__input" name="residentialAddress"
                                       ng-model="addressDetailsCtrl.fromContactFields.residentialAddress"
                                       data-aqa-id="checkbox_residentialAddressfrom">
                                    <span class="label checkbox__label">
                                        <fmt:message key="address_details.residential_address"/>
                                    </span>
                                </label>
                                <div class="row" ng-if="!addressDetailsCtrl.saveFromConfirmed && !addressDetailsCtrl.updateFromConfirmed">
                                    <button type="button" class="btn btn_action"
                                       ng-if="addressDetailsCtrl.fromShowCreateButton"
                                       ng-click="addressDetailsCtrl.showSaveContactDialog(addressDetailsCtrl.FROM)">
                                        <fmt:message key="address_details_save_contact"/>
                                    </button>
                                    <button type="button" class="btn btn_action"
                                       ng-if="addressDetailsCtrl.fromShowUpdateButton"
                                       ewf-click="addressDetailsCtrl.updateContact(addressDetailsCtrl.FROM)">
                                        <fmt:message key="address_details_update_contact"/>
                                    </button>
                                </div>
                                <div class="row"
                                   ng-if="addressDetailsCtrl.updateFromConfirmed">
                                    <i class="dhlicon-check"></i><fmt:message key="address_details_address_updated"/>
                                </div>
                                <div class="row"
                                   ng-if="addressDetailsCtrl.saveFromConfirmed">
                                    <i class="dhlicon-check"></i><fmt:message key="address_details_address_saved"/> {{addressDetailsCtrl.fromNickname}}
                                </div>
                                <p>
                                   <a ng-if="addressDetailsCtrl.fromShowCreateButton"
                                      ng-click="addressDetailsCtrl.clearAddressFrom()">
                                       <fmt:message key="address_details.clear_address"/>
                                   </a>
                                </p>
                            </div>
                            <div class="col-2">
                                <div class="divider"></div>
                                <div class="swap-wrapper"
                                   ng-if="addressDetailsCtrl.isAuthorized">
                                    <div class="tooltip">
                                        <button type="button" class="btn tooltip"
                                           ng-click="addressDetailsCtrl.swapAddresses()">
                                            <i class="dhlicon-switch"></i>
                                            <fmt:message key="common.switch"/>
                                        </button>
                                        <span>
                                            <fmt:message key="address_details.switch_from_to"/>
                                            <a ng-click="addressDetailsCtrl.redirectToHelpCenterPage();">
                                                <fmt:message key="address_details_switch_from_to_message_link"/>
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="col-5">
                                <cq:include path="toAddress" resourceType="dhl/components/addressbook/dhl-address"/>
                                <div class="field-wrapper">
                                    <label for="toEmail" class="label"><fmt:message key="address_details.email"/></label>
                                    <input id="toEmail" class="input input_width_full" type="text"
                                       ng-model="addressDetailsCtrl.toContactFields.email"
                                       ewf-input="contactDetails.toEmail"
                                       ewf-validate-email>
                                </div>
                                <cq:include path="toPhone" resourceType="dhl/components/addressbook/dhl-phone-component"/>
                                <div class="row">
                                    <div class="field-wrapper" ewf-field>
                                        <label for="toVatTax" class="label"><fmt:message key="address_details_vat_tax"/></label>
                                        <input id="toVatTax" class="input input_width_full" type="text" name="toVatTax"
                                           ewf-input
                                           ng-model="addressDetailsCtrl.toContactFields.vatTax">
                                    </div>
                                </div>
                                <label class="checkbox" ng-if="addressDetailsCtrl.toContactFields.addrLine1">
                                    <input type="checkbox" id="checkbox_residentialAddressto" class="checkbox__input" name="residentialAddress"
                                       ng-model="addressDetailsCtrl.toContactFields.residentialAddress"
                                       data-aqa-id="checkbox_residentialAddressto">
                                    <span class="label checkbox__label">
                                        <fmt:message key="address_details.residential_address"/>
                                    </span>
                                </label>
                                <div class="row"
                                   ng-if="!addressDetailCtrl.saveToConfirmed && !addressDetailsCtrl.updateToConfirmed">
                                    <button type="button" class="btn btn_action"
                                       ng-if="addressDetailsCtrl.toShowCreateButton"
                                       ng-click="addressDetailsCtrl.showSaveContactDialog(addressDetailsCtrl.TO)">
                                        <fmt:message key="address_details_save_contact"/>
                                    </button>
                                    <button type="button" class="btn btn_action"
                                       ng-if="addressDetailsCtrl.toShowUpdateButton"
                                       ng-click="addressDetailsCtrl.updateContact(addressDetailsCtrl.TO)">
                                        <fmt:message key="address_details_update_contact"/>
                                    </button>
                                </div>
                                <div class="row"
                                   ng-if="addressDetailsCtrl.updateToConfirmed">
                                    <i class="dhlicon-check"></i><fmt:message key="address_details_address_updated"/>
                                </div>
                                <div class="row"
                                   ng-if="addressDetailsCtrl.saveToConfirmed">
                                    <i class="dhlicon-check"></i><fmt:message key="address_details_address_saved"/> {{addressDetailsCtrl.toNickname}}
                                </div>
                                <p>
                                    <a ng-if="addressDetailsCtrl.toShowCreateButton"
                                       ng-click="addressDetailsCtrl.clearAddressTo()">
                                        <fmt:message key="address_details.clear_address"/>
                                    </a>
                                </p>
                            </div>
                        </div>
                        <footer class="area__footer">
                            <button type="submit" class="btn btn_success right"
                               ng-click="addressDetailsCtrl.onNextClick(contactDetails, ewfFormCtrl)">
                                <fmt:message key="common.next"/>
                            </button>
                        </footer>
                    </form>
                </div>
            </section>
        </div>
        <div class="synopsis"
           ng-if="!addressDetailsCtrl.editModeActive">
            <a class="synopsis__edit btn btn_action"
               ng-click="addressDetailsCtrl.onEditClick()">
                <fmt:message key="common.edit"/>
            </a>

            <div class="row">
                <div class="col-6 synopsis_with-icon">
                    <i class="synopsis__icon dhlicon-from"></i>
                    <strong><fmt:message key="common.from"/>:</strong><br>

                    <div ng-bind="addressDetailsCtrl.fromContactFields.name"></div>
                    <div ng-bind="addressDetailsCtrl.fromContactFields.company"
                       ng-show="addressDetailsCtrl.fromContactFields.company">
                    </div>
                    <div ng-bind="addressDetailsCtrl.addLineFrom"></div>
                    <div ng-bind="addressDetailsCtrl.fromContactFields.addrLine2"
                       ng-show="addressDetailsCtrl.fromContactFields.addrLine2">
                    </div>
                    <div ng-bind="addressDetailsCtrl.fromContactFields.email"></div>
                    <span ng-bind="addressDetailsCtrl.fromContactFields.phoneCountryCode"></span>
                    <span ng-bind="addressDetailsCtrl.fromContactFields.phone"></span>

                    <div ng-bind="addressDetailsCtrl.fromContactFields.countryCode.name">
                        TempCountry
                    </div>
                </div>
                <div class="col-6 synopsis_with-icon">
                    <i class="synopsis__icon dhlicon-to"></i>
                    <strong><fmt:message key="common.to"/>:</strong><br>

                    <div ng-bind="addressDetailsCtrl.toContactFields.name"></div>
                    <div ng-bind="addressDetailsCtrl.toContactFields.company"
                       ng-show="addressDetailsCtrl.toContactFields.company">
                    </div>
                    <div ng-bind="addressDetailsCtrl.addLineTo">
                    </div>
                    <div ng-bind="addressDetailsCtrl.toContactFields.addrLine2"
                       ng-show="addressDetailsCtrl.toContactFields.addrLine2">
                    </div>
                    <div ng-bind="addressDetailsCtrl.toContactFields.email"
                       ng-show="addressDetailsCtrl.toContactFields.email">
                    </div>
                    <span ng-bind="addressDetailsCtrl.toContactFields.phoneCountryCode"></span>
                    <span ng-bind="addressDetailsCtrl.toContactFields.phone">
                    1231231231
                    </span>
                    <div ng-bind="addressDetailsCtrl.toContactFields.countryCode.name">
                        Test Country
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</ewf-address-details>
