<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="ewf-pickup,
            pickup-packagings"
        paths="components/shipment/pickup/ewf-pickup-directive,
            components/shipment/pickup/pickup-packagings/pickup-packagings-directive"/>

<ewf-pickup ewf-form="pickup">
<div id="section_pickup" class="area-wrap"
    ng-cloak
    ng-form="pickupForm"
    ng-if="pickupCtrl.initialized">
    <section class="area" ng-if="pickupCtrl.editModeActive">
        <header class="area__header">
            <h2 class="area__title h2"><fmt:message key="pickup_title"/></h2>
        </header>
        <div class="area__content">
            <div class="field-group row">
                <div class="col-8">
                    <div class="row">
                        <div class="col-6">
                            <div class="switcher switcher_width_full">
                                <input type="radio" class="switcher__input" name="needsPickup" value="pickup" id="radio_howStartShipping_yes"
                                   ng-model="pickupCtrl.howStartShipping"
                                   ng-class="{checked : pickupCtrl.isPickupRequired()}"
                                   ng-change="pickupCtrl.onPickupTypeSelection()">
                                <label for="radio_howStartShipping_yes" class="switcher__label"><fmt:message key="pickup_need_dhl_courier"/></label>
                                <div class="switcher__details"></div>
                            </div>
                            <div class="alert alert_warning alert_small" ng-if="pickupCtrl.isPickupRequired()">
                                <fmt:message key="pickup_additional_charges"/>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="switcher switcher_width_full">
                                <input type="radio" class="switcher__input" name="needsPickup" value="dropoff" id="radio_howStartShipping_no"
                                    ng-model="pickupCtrl.howStartShipping"
                                    ng-class="{checked : pickupCtrl.isDropoffRequred()}"
                                    ng-change="pickupCtrl.onPickupTypeSelection()">
                                <label for="radio_howStartShipping_no" class="switcher__label"><fmt:message key="pickup_no_need_dhl_courier"/></label>
                                <div class="switcher__details"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-4 callout margin-top-none"
                   ng-if="pickupCtrl.isTSANotificationShown || pickupCtrl.isPickupRequired()">
                    <div ng-if="pickupCtrl.isTSANotificationShown">
                        <h4 class="h4 callout__title margin-none"><fmt:message key="pickup_tsa_privacy_act_notification"/></h4>
                        <div class="callout__content">
                            <p><fmt:message key="pickup_tsa_privacy_act_notification_please_read_col1"/>
                                <a ng-click="pickupCtrl.openTSANotification()">
                                    <fmt:message key="pickup_tsa_privacy_act_notification_please_read_col2"/>
                                </a>
                                <fmt:message key="pickup_tsa_privacy_act_notification_please_read_col3"/>
                            </p>
                        </div>
                    </div>
                    <div ng-if="pickupCtrl.isPickupRequired()">
                        <h4 class="h4 callout__title margin-none"><fmt:message key="pickup_courier_endeavour_title" /></h4>
                        <div class="callout__content">
                            <p><fmt:message key="pickup_courier_endeavour_message" /></p>
                        </div>
                    </div>
                </div>
            </div>
            <div ng-if="pickupCtrl.isDropoffRequred()">
                <a><fmt:message key="pickup_where_can_i_drop_my_shipment_off"/></a>
                <div class="row" ng-if="pickupCtrl.isPickupScheduled">
                    <div class="col-8">
                        <div class="alert alert_info">
                            <button class="alert__close" type="button"
                               ng-click="pickupCtrl.closeScheduledPickupNotification()">
                            </button>
                            <fmt:message key="pickup_scheduled_pickup"/>
                        </div>
                    </div>
                </div>
            </div>
            <div ng-if="pickupCtrl.isPickupRequired()">
                 <div class="overlay-grey">
                    <div class="row">
                        <div class="col-3">
                            <fmt:message key="pickup_sending_my_shipment_on"/>
                            <a class="help"><span><fmt:message key="pickup_sending_my_shipment_on_tooltip"/></span></a>
                            <br>
                            <br>
                            <div class="delivery-date__container">
                                <div class="delivery-date__month">{{pickupCtrl.pickupDate.month}}</div>
                                <div class="delivery-date__date">{{pickupCtrl.pickupDate.date}}</div>
                                <div class="delivery-date__day">{{pickupCtrl.pickupDate.day}}</div>
                            </div>
                            <br>
                            <a class="btn btn_action" ng-click="pickupCtrl.changePickupDate()"><fmt:message key="edit"/></a>
                        </div>
                        <div class="col-9 a-center">
                            <fmt:message key="pickup_pickup_window"/><a class="info">
                                <div><fmt:message key="pickup_what_is_earliest_shipment"/></div>
                            </a><br>

                            <div ng-class="{'pickup-hidden-wrapper': !pickupCtrl.isPickupSliderShown,
                                            'pickup-shown-wrapper': pickupCtrl.isPickupSliderShown}">
                                <input type="text" id="range-slider" name="example_name" value=""
                                   ng-show="pickupCtrl.isPickupSliderShown"/>
                                <strong id="earliest-pickup"><fmt:message key="pickup_earliest"/></strong>
                                <strong id="latest-pickup"><fmt:message key="pickup_latest"/></strong>
                            </div>
                            <br>
                            <fmt:message key="pickup_pickup_window_lead_time"/><br>
                            <span ng-bind-html="pickupCtrl.bookByMessage" ng-if="pickupCtrl.isBookByMessageShown"></span>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-5">
                        <div class="field-wrapper">
                            <label class="label"><fmt:message key="pickup_where_courier_pickup_shipment"/></label>
                            <span class="select full-width" ewf-field="pickupLocation">
                                <select ng-model="pickupCtrl.pickupLocation"
                                    ng-options="option as pickupCtrl.resolvePickupLocationName(option) for option in pickupCtrl.pickupLocations track by option.name"
                                    name="pickupLocation"
                                    ewf-input="pickup.pickupLocation"
                                    ewf-validate-required>
                                    <option class="is-hidden" selected disabled value="">
                                        <fmt:message key="pickup_select_location"/>
                                    </option>
                                </select>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </span>
                        </div>
                        <div class="field-wrapper" ng-if="pickupCtrl.isOtherPickupLocation()" ewf-field="pickupOtherLocationDescription">
                            <label class="label"><fmt:message key="pickup_describe_pickup_location"/></label>
                            <input type="text" class="input input_width_full" name="pickupLocationOtherDescription" value=""
                                ng-model="pickupCtrl.pickupLocationOtherDescription"
                                ewf-input="pickup.pickupOtherLocationDescription"
                                ewf-validate-required>
                        </div>
                        <div class="field-wrapper" ewf-field="pickupTotalWeight">
                            <label class="label"><fmt:message key="pickup_total_weight"/></label>
                            <input class="input" type="text" name="pickupTotalWeight"
                                ng-model="pickupCtrl.totalPickupWeight.value"
                                ewf-input="pickup.pickupTotalWeight"
                                ewf-validate-pattern="^-?\d*\.?\d*$">
                            <span nls="{{pickupCtrl.totalPickupWeight.unit}}"></span>
                        </div>
                        <label class="label"><fmt:message key="pickup_special_instruction_for_courier"/></label>
                        <textarea maxlength="150" class="textarea textarea_width_full" name="pickupSpecialInstructions"
                            ng-model="pickupCtrl.pickupSpecialInstructions"
                            placeholder="<fmt:message key="pickup_provide_special_instruction"/>">
                        </textarea>
                        <div ng-if="pickupCtrl.packagingsAvailable">
                            <hr>
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input"
                                   ng-model="pickupCtrl.requirePackagings">
                                <span class="label"><fmt:message key="pickup_is_packagings_required"/></span>
                            </label>
                            <div ng-form name="pickupCtrl.pickupPackagingsForm"
                               ng-if="pickupCtrl.requirePackagings"
                               ewf-form="pickupPackagings">
                                <hr>
                                <div ng-model="pickupCtrl.packagings"
                                   pickup-packagings
                                   country="pickupCtrl.shipmentCountry">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-2"></div>
                    <div class="col-5">
                         <cq:include script="dhl-edit-address.jsp"/>
                    </div>
                </div>
            </div>
            <footer class="area__footer a-right"
               ng-if="pickupCtrl.isNextButtonVisible()">
                <a class="btn btn_success" ng-click="pickupCtrl.onNextClick(pickupForm, ewfFormCtrl)"><fmt:message key="next"/></a>
            </footer>
        </div>
    </section>

    <div class="synopsis" ng-if="!pickupCtrl.editModeActive">
        <a class="synopsis__edit btn btn_action" ng-click="pickupCtrl.onEditClick()"><fmt:message key="edit"/></a>

        <div class="row">
            <div class="col-6 synopsis_with-icon">
                <i class="synopsis__icon dhlicon-truck"></i>
                <b><fmt:message key="pickup_title"/></b><br>
                {{pickupCtrl.pickupDate.shortDate}}
            </div>
            <div class="col-6">
                <b><fmt:message key="pickup_earliest_pickup_time"/></b>
                {{pickupCtrl.getFormattedTime(pickupCtrl.pickupTime.readyByTime)}}
                <br>
                <b><fmt:message key="pickup_latest_pickup_time"/></b>
                {{pickupCtrl.getFormattedTime(pickupCtrl.pickupTime.closeTime)}}
            </div>
        </div>
    </div>
</div>

</ewf-pickup>
