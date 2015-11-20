<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<slice:lookup var="componentProperties" appName="dhlApp" type="<%=com.dhl.components.model.ComponentProperties.class%>" />

<ewf:registerComponent
        elements="contact-notifications-info"
        paths="directives/ewf-input/ewf-input-controller,
            directives/ewf-validate/ewf-validate-email-directive,
            directives/ewf-validate/ewf-validate-pattern-directive"/>

<script type="text/ng-template" id="phone-country-code.html">
    <a>
        <i class="flag flag_{{match.model.code2}}"></i><span>{{match.model.name}}</span><strong>{{match.model.phoneCode}}</strong>
    </a>
</script>

<contact-notifications-info notification-settings="${componentProperties.parentControllerObject}">
    <div class="overlay-white"
       ewf-form="contactNotificationsInfo"
       ng-form="contactNotificationsInfoForm">
        <div class="nav right">
            <a id="contactNotificationShowEditInfo" class="nav__item btn btn_action"
               ng-click="contactNotificationsInfoCtrl.toggleLayout()"
               ng-hide="contactNotificationsInfoCtrl.isEditing">
                <i class="dhlicon-pencil"></i>
                <span><fmt:message key="edit_btn"/></span>
            </a>
        </div>
        <div class="nav right">
            <a id="contactNotificationHideEditInfo" class="nav__item btn btn_action"
               ng-click="contactNotificationsInfoCtrl.toggleLayout()"
               ng-show="contactNotificationsInfoCtrl.isEditing">
                <i class="dhlicon-pencil"></i>
                <span><fmt:message key="hide_btn"/></span>
            </a>
        </div>
        <h3 class="margin-none"><fmt:message key="notifications_label"/></h3>

        <div ng-show="contactNotificationsInfoCtrl.isEditing" class="row">
            <div class="contact-notifications">

                <div class="overlay-grey" ng-repeat="notification in contactNotificationsInfoCtrl.attributes.notificationSettings">
                    <div class="row">
                        <div class="col-3">
                            <label class="label"><fmt:message key="notifications_type_label"/></label>
                            <span class="select select_width_full">
                                <select id="notificationTypeId" name="notificationTypeName"
                                   ng-options="notificationMessageType for notificationMessageType in contactNotificationsInfoCtrl.notificationTypes track by notificationMessageType"
                                   ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].type"
                                   ng-change="contactNotificationsInfoCtrl.clearDestination(notification)">
                                </select>
                            </span>
                        </div>
                        <div class="col-5" ng-if="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].type === 'EMAIL'">
                            <label class="label"><fmt:message key="email_label"/></label>
                            <div class="field-wrapper" ewf-field="{{'email_' + $index}}">
                                <input type="text" name="{{'notificationEmail_' + $index}}" class="input input_width_full"
                                   ewf-input="{{'contactNotificationsInfo.email_' + $index}}"
                                   ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].destination"
                                   ewf-validate-email>
                                <div ewf-field-errors></div>
                            </div>
                        </div>

                        <div class="col-3" ng-if="notification.type === 'SMS'">
                            <label class="label"><fmt:message key="country_code_label"/></label>
                            <div class="field phone-autocomplete" ewf-field="{{'smsNotifications[' + $index + '].phoneCountryCode'}}">
                                <i class="phone-autocomplete__flag flag flag_small flag_"></i>
                                <input type="text" name="notificationPhoneCode" class="input input_width_full" autocomplete="off"
                                   ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].phoneCountryCode"
                                   typeahead="countryCode.name for countryCode in contactNotificationsInfoCtrl.attributes.countryCodes"
                                   typeahead-template-url="phone-country-code.html"
                                   typeahead-min-length="2"
                                   typeahead-on-select="contactNotificationsInfoCtrl.phoneCodeSelected($item, $index)"
                                   ewf-input="{{'contactNotificationsInfo.smsNotifications[' + $index + '].phoneCountryCode'}}"
                                   ewf-validate-pattern="PHONE_COUNTRY_CODE">
                                <div ewf-field-errors></div>
                            </div>
                        </div>
                        <div class="col-5" ng-if="notification.type === 'SMS'" ewf-field="{{'phone_' + $index}}">
                            <label class="label"><fmt:message key="mobile_phone_label"/></label>
                            <input type="text" class="input input_width_full" name="{{'notificationPhoneNumber_' + $index}}"
                               ewf-input="{{'contactNotificationsInfo.phone_' + $index}}"
                               ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].destination"
                               ewf-validate-pattern="PHONE_NUMBER"
                               ewf-validate-pattern-options="{patternModifier:true}">
                            <div ewf-field-errors></div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-4">
                            <label class="label"><fmt:message key="language_label"/></label>
                                <span class="select select_width_full">
                                    <select id="notifyLanguageId" name="notifyLanguageName"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].language">
                                        <option selected value="en"><fmt:message key="notifications_english_label"/></option>
                                    </select>
                                </span>
                        </div>
                    </div>
                    <div>
                        <ewf-content-slider show-when="contactNotificationsInfoCtrl.helpActive[$index]">
                            <ewf-content-slider-item header="How do Notification Settings Work?">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message1"/></div>
                            </ewf-content-slider-item>
                            <ewf-content-slider-item header="Picked Up by Courier">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message2"/></div>
                            </ewf-content-slider-item>
                            <ewf-content-slider-item header="Customs Delay">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message3"/></div>
                            </ewf-content-slider-item>
                            <ewf-content-slider-item header="Cleared Customs">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message4"/></div>
                            </ewf-content-slider-item>
                            <ewf-content-slider-item header="Delivered">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message5"/></div>
                            </ewf-content-slider-item>
                            <ewf-content-slider-item header="Alert">
                                <div class="section-help__tab__content__notifications"><fmt:message key="notifications_help_message6"/></div>
                            </ewf-content-slider-item>
                        </ewf-content-slider>

                        <label class="label">
                            <span><fmt:message key="notify_about_shipment_status_label"/></span>
                             <a class="section-help__link right"
                                ng-click="contactNotificationsInfoCtrl.toggleHelpActive($index)">
                                 <i class="dhlicon-help"></i>
                                 <fmt:message key="notifications_help_link_title"/>
                             </a>
                        </label>

                        <div class="row form-group form-group_small">
                            <div class="col-4">
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyPickup[]"
                                       data-aqa-id="{{'checkbox_notifyPickup' + $index }}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.pickup">
                                    <span class="label" for="{{'checkbox_notifyPickup' + $index }}">
                                        <ewf:nls bundle="shipment-notifications" key="pickup"/>
                                    </span>
                                </label>
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyException[]"
                                       data-aqa-id="{{'checkbox_notifyException' + $index}}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.exception">
                                    <span class="label">
                                        <ewf:nls bundle="shipment-notifications" key="exception"/>
                                    </span>
                                </label>
                            </div>
                            <div class="col-4">
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyClearanceDelay[]"
                                       data-aqa-id="{{'checkbox_notifyClearanceDelay' + $index}}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.clearanceDelay">
                                    <span class="label">
                                        <ewf:nls bundle="shipment-notifications" key="clearance_delay"/>
                                    </span>
                                </label>
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyOutForDelivery[]"
                                       data-aqa-id="{{'checkbox_notifyOutForDelivery' + $index}}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.outForDelivery">
                                    <span class="label">
                                        <ewf:nls bundle="shipment-notifications" key="out_for_delivery"/>
                                    </span>
                                </label>
                            </div>
                            <div class="col-4">
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyCustomsClearance[]"
                                       data-aqa-id="{{'checkbox_notifyCustomsClearance' + $index}}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.customsClearance">
                                    <span class="label">
                                        <ewf:nls bundle="shipment-notifications" key="customs_clearance"/>
                                    </span>
                                </label>
                                <label class="checkbox checkbox_small">
                                    <input type="checkbox" class="checkbox__input" name="notifyDelivered[]"
                                       data-aqa-id="{{'checkbox_notifyDelivered' + $index}}"
                                       ng-model="contactNotificationsInfoCtrl.attributes.notificationSettings[$index].notificationEvents.delivered">
                                    <span class="label">
                                        <ewf:nls bundle="shipment-notifications" key="delivered"/>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="a-right">
                        <a class="btn btn_action m-top"
                           ng-click="contactNotificationsInfoCtrl.removeRepeaterItem(notification)"
                           ng-if="contactNotificationsInfoCtrl.attributes.notificationSettings.length > 1">
                            <i class="dhlicon-cancel"></i>
                            <span><fmt:message key="remove_label"/></span>
                        </a>
                    </div>
                </div>
            </div>
            <button class="btn btn_animate btn_small"
               ng-click="contactNotificationsInfoCtrl.addRepeaterItem()"
               ng-disabled="!contactNotificationsInfoCtrl.canAddContactNotification(contactNotificationsInfoForm)">
                <i class="dhlicon-add"></i>
                <span class="btn__text"><fmt:message key="add_another_label"/></span>
            </button>
        </div>
    </div>
</contact-notifications-info>
