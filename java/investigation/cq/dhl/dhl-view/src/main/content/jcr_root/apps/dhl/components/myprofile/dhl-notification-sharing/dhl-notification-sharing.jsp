<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent
        elements="notification-sharing,
            ewf-content-slider,
            ewf-content-slider-item"
        paths="components/notification-sharing-settings/notification-sharing-directive,
            directives/ewf-form/ewf-form-directive,
            directives/ewf-validate/ewf-validate-pattern-directive,
            directives/ewf-validate/ewf-validate-email-directive,
            directives/ewf-click/ewf-click-directive,
            directives/ewf-content-slider/ewf-content-slider-directive,
            directives/ewf-spinner/ewf-spinner-directive"/>

<div class="spinner-wrapper"
   ewf-spinner
   data-aq-id="spinner"
   ng-show="ewfSpinnerCtrl.isSpinnerVisible()">
    <div class="spinner-wrapper__spinner"></div>
</div>

<notification-sharing class="dhl-notification-sharing" id="top-origin">
    <form name="sharingListForm" ewf-form="sharingListForm" class="contact-details-form" novalidate>
    <div class="row">
        <div class="col-6">
            <h3 class="m-none">
                <fmt:message key="nfn_shr__heading"/>
            </h3>
        </div>
        <hr class="hr">
        <p><fmt:message key="nfn_shr__info"/></p>
        <ul>
            <li><fmt:message key="nfn_shr__info_notification"/></li>
            <li><fmt:message key="nfn_shr__info_sharing"/></li>
        </ul>
    </div>

    <div class="alert alert_success m-top-none"
       ng-if="notificationSharingCtrl.sharingListUpdated">
        <fmt:message key="nfn_shr__success_msg"/>
    </div>

    <div class="overlay-white m-top-none">
        <h4 class="m-bottom-none"><fmt:message key="nfn_shr__default_sender_heading"/></h4>
        <div class="row m-top-small">
            <fmt:message key="nfn_shr__default_sender_info"/>
        </div>
        <div class="row m-top">
            <div class="col-7" ewf-field="senderEmail">
                <span class="fw-bold m-right-small"><fmt:message key="nfn_shr__default_sender_email_label"/></span>
                    <input type="text" class="input input_width_half" placeholder="sender@email.com" name="email"
                       ng-model="notificationSharingCtrl.sharingList.senderEmail"
                       ewf-input="sharingListForm.senderEmail"
                       ewf-validate-email>
                    <div ewf-field-errors></div>
            </div>
        </div>
    </div>

    <div class="overlay-white">
        <div class="row">
            <div class="col-6">
                <h4 class="m-top-none">
                    <fmt:message key="nfn_shr__shipm_status_heading"/>
                    <a href="#" class="info"><span><fmt:message key="nfn_shr__shipm_status_help"/></span></a>
                </h4>
            </div>
            <div class="col-6">
                <a class="section-help__link right"
                   ng-click="notificationSharingCtrl.helpOpen.shipStatus = !notificationSharingCtrl.helpOpen.shipStatus">
                    <fmt:message key="digital_customs_invoices_help_with_this"/>
                </a>
                <ewf-content-slider show-when="notificationSharingCtrl.helpOpen.shipStatus">
                    <ewf-content-slider-item header="<fmt:message key="nfn_shr__shipm_status_help_title"/>">
                        <fmt:message key="nfn_shr__shipm_status_help_slide_1"/>
                    </ewf-content-slider-item>
                    <ewf-content-slider-item header="<fmt:message key="nfn_shr__shipm_status_help_title"/>">
                        <fmt:message key="nfn_shr__shipm_status_help_slide_1"/>
                    </ewf-content-slider-item>
                </ewf-content-slider>
            </div>
        </div>
        <p class="m-none"><fmt:message key="nfn_shr__shipm_status_info"/></p>
        <div class="row m-top-small">
            <div class="col-9">
                <div class="fw-bold">
                    <fmt:message key="nfn_shr__shipm_status_label"/>
                </div>
            </div>
        </div>
        <div class="row m-top">
            <div class="row">
                <div class="col-2">&nbsp;</div>
                <div class="col-10">
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="pickup"/></div>
                    </div>
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="clearance_delay"/></div>
                    </div>
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="customs_clearance"/></div>
                    </div>
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="exception"/></div>
                    </div>
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="out_for_delivery"/></div>
                    </div>
                    <div class="col-2">
                        <div class="fw-bold"><ewf:nls bundle="shipment-notifications" key="delivered"/></div>
                    </div>
                </div>
            </div>
            <hr class="hr m-top-small m-bottom-small">
            <div class="row">
                <div class="col-2 fw-bold text_gray">
                    <fmt:message key="nfn_shr__shipm_status_recipient_label"/>
                </div>
                <div class="col-10">
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_pickedByCourier_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.pickup">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_pickedByCourier_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.pickup">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_clearanceDelay_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.clearanceDelay">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_clearanceDelay_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.clearanceDelay">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_customsClearance_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.customsClearance">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_customsClearance_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.customsClearance">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_exception_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.exception">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_exception_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.exception">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_outForDelivery_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.outForDelivery">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_outForDelivery_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.outForDelivery">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_delivered_email"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientEmail.delivered">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" class="checkbox__input"
                               data-aqa-id="rec_delivered_sms"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.recipientSms.delivered">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
            <hr class="hr m-top-small m-bottom-none">
            <div class="row m-top-small">
                <div class="col-2 fw-bold text_gray">
                    <fmt:message key="nfn_shr__shipm_status_user_label"/>
                </div>
                <div class="col-10">
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.pickup"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_pickup_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.pickup"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_pickup_sms">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.clearanceDelay"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_clearanceDelay_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.clearanceDelay"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_clearanceDelay_sms">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.customsClearance"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_customsClearance_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.customsClearance"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_customsClearance_sms">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.exception"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_exception_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.exception"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_exception_sms">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.outForDelivery"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_outForDelivery_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.outForDelivery"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_outForDelivery_sms">
                            <span for="my_exception_sms" class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                    <div class="col-2">
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.myEmail.delivered"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_delivered_email">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_email"/>
                            </span>
                        </label>
                        <label class="checkbox">
                            <input class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.notifyOnStatus.mySms.delivered"
                               ng-disabled="notificationSharingCtrl.isNotificationDisabled()"
                               data-aqa-id="my_delivered_sms">
                            <span class="label">
                                <fmt:message key="nfn_shr__shipm_status_user_sms"/>
                            </span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
        <small><fmt:message key="nfn_shr__shipm_status_small_text"/><a href="/content/dhl/usa/en/address-book.html"><fmt:message key="nfn_shr__shipm_status_small_link"/></a>.</small>
    </div>

    <div class="overlay-white">
        <h4><fmt:message key="nfn_shr__shipm_details_heading"/></h4>
        <div class="row">
            <p><fmt:message key="nfn_shr__shipm_details_info"/></p>
            <a data-aqa-id="showMoreLink"
               ng-if="!notificationSharingCtrl.isMoreInfoShown()"
               ng-click="notificationSharingCtrl.showMoreInfo()">
                <fmt:message key="nfn_shr__shipm_details_more_link"/>
            </a>
            <span data-aqa-id="showMoreContent"
               ng-if="notificationSharingCtrl.isMoreInfoShown()">
                <fmt:message key="nfn_shr__shipm_details_more_text"/>
            </span>
        </div>
        <div class="row m-top fw-bold">
            <fmt:message key="nfn_shr__shipm_details_label"/>
        </div>
        <div class="row checkbox m-top-small">
            <label class="checkbox">
                <input type="checkbox" id="email_oneTimeShip_receiver" class="checkbox__input"
                   data-aqa-id="email_oneTimeShip_receiver"
                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.shareDetailsWith.receiver">
                <span class="label m-right-small">
                    <fmt:message key="nfn_shr__shipm_details_reciever"/>
                </span>
            </label>
            <label class="checkbox">
                <input type="checkbox" id="email_oneTimeShip_sender" class="checkbox__input"
                   data-aqa-id="email_oneTimeShip_sender"
                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.shareDetailsWith.sender">
                <span class="label m-right-small">
                    <fmt:message key="nfn_shr__shipm_details_sender"/>
                </span>
            </label>
        </div>
        <div class="row m-top-small email-group"
           ng-form="emailsForm">
            <label class="block"><fmt:message key="nfn_shr__shipm_details_input_label"/></label>
            <div class="field email-group__email"
               ng-if="notificationSharingCtrl.sharingList.shipmentSharingDefaults.shareDetailsWith.emails.length"
               ng-repeat="email in notificationSharingCtrl.sharingList.shipmentSharingDefaults.shareDetailsWith.emails track by $index"
               ng-class="{'inline-block m-right-small': $index === 0}" >
                <span ewf-field="emails_{{$index}}" class="field inline-block">
                    <input type="text" name="emails_{{$index}}" placeholder="shared@email.com" class="input"
                       ewf-input="sharingListForm.emails_{{$index}}"
                       ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.shareDetailsWith.emails[$index]"
                       ng-change="notificationSharingCtrl.blockAddButtonIfEmpty()"
                       ewf-validate-email>
                        <div ewf-field-errors></div>
                </span>
                <div class="btn btn_action"
                   ng-if="notificationSharingCtrl.emailsCount > 1"
                   ng-click="notificationSharingCtrl.removeEmail($index)">
                    <i class="dhlicon-remove"></i><fmt:message key="nfn_shr__shipm_details_btn_rmv"/>
                </div>
            </div>
            <div class="btn btn_small"
               ng-click="notificationSharingCtrl.addEmail()"
               ng-hide="notificationSharingCtrl.emailsCount === 5"
               ng-disabled="notificationSharingCtrl.blockAddBtn || emailsForm.$invalid">
                <i class="dhlicon-add"></i>
                <span class="btn__text"><fmt:message key="nfn_shr__shipm_details_btn_add"/></span>
            </div>
        </div>

        <div class="row m-top">
            <div class="tabs b-none">
                <h4><fmt:message key="nfn_shr__email_tpl_heading"/></h4>

                <ul class="tabs__labels m-bottom-none">
                    <li class="tabs__item fw-bold"
                       ng-class="{'is-active': notificationSharingCtrl.isActiveTab('standard')}"
                       ng-click="notificationSharingCtrl.setActiveTab('standard')">
                        <span><fmt:message key="nfn_shr__email_tpl_dhl_heading"/></span>
                    </li>
                    <li class="tabs__item fw-bold"
                       ng-class="{'is-active': notificationSharingCtrl.isActiveTab('custom')}"
                       ng-click="notificationSharingCtrl.setActiveTab('custom')">
                        <span><fmt:message key="nfn_shr__email_tpl_custom_heading"/></span>
                    </li>
                </ul>

                <div class="tabs__content overlay-white m-none"
                   ng-show="notificationSharingCtrl.isActiveTab('standard')">
                    <label class="checkbox">
                        <input id="default_template" class="checkbox__input" type="checkbox"
                           data-aqa-id="default_template"
                           ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.useAsDefaults">
                        <span class="label fw-bold">
                            <fmt:message key="nfn_shr__email_tpl_dhl_label"/>
                        </span>
                    </label>
                    <div class="row m-top-small">
                        <div class="fw-bold">
                            <fmt:message key="nfn_shr__email_tpl_dhl_info"/>
                        </div>
                        <div class="m-top-small">
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input" id="standard_tracking"
                                   data-aqa-id="standard_tracking"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.trackingNumber">
                                <span class="label">
                                    <fmt:message key="nfn_shr__email_tpl_dhl_track_num"/>
                                </span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input" id="standard_pickup"
                                   data-aqa-id="standard_pickup"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.pickupConfirmationNumber">
                                <span class="label">
                                    <fmt:message key="nfn_shr__email_tpl_dhl_confirm_num"/>
                                </span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input" id="standard_shipping"
                                   data-aqa-id="standard_shipping"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.shippingLabel">
                                <span class="label">
                                    <fmt:message key="nfn_shr__email_tpl_dhl_ship_label"/>
                                </span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input" id="standard_customs"
                                   data-aqa-id="standard_customs"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.customsInvoice">
                                <span class="label">
                                    <fmt:message key="nfn_shr__email_tpl_dhl_custom_invoice"/>
                                </span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" class="checkbox__input" id="standard_receipt"
                                   data-aqa-id="standard_receipt"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.shippingReceipt">
                                <span class="label">
                                    <fmt:message key="nfn_shr__email_tpl_dhl_receipt"/>
                                </span>
                            </label>
                        </div>
                    </div>
                    <div class="row m-top-small">
                        <div class="field-wrapper">
                            <div class="fw-bold">
                                <fmt:message key="nfn_shr__email_msg_label"/>
                            </div>
                            <textarea class="textarea textarea_width_full" id="detailsToShareMessage"
                               ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.dhlTemplate.detailsToShare.message">
                            </textarea>
                        </div>
                    </div>
                </div>

                <div class="tabs__content overlay-white m-none"
                   ng-show="notificationSharingCtrl.isActiveTab('custom')">
                    <div class="row">
                        <div class="col-7">
                            <label class="checkbox">
                                <input id="custom_template_checkbox" class="checkbox__input" type="checkbox"
                                   data-aqa-id="custom_template_checkbox"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.customTemplate.useAsDefaults">
                                <span class="label fw-bold">
                                    <fmt:message key="nfn_shr__email_tpl_set_default_label"/>
                                </span>
                            </label>
                        </div>
                        <div class="col-5">
                            <a class="section-help__link right" id="custom_template_help_link"
                               data-aqa-id="custom_template_help_link"
                               ng-click="notificationSharingCtrl.helpOpen.shipDetails = !notificationSharingCtrl.helpOpen.shipDetails">
                                <fmt:message key="nfn_shr__email_tpl_help_link"/>
                            </a>
                            <ewf-content-slider show-when="notificationSharingCtrl.helpOpen.shipDetails">
                                <ewf-content-slider-item header="<fmt:message key="nfn_shr__email_tpl_help_slide_title_1"/>">
                                    <fmt:message key="nfn_shr__email_tpl_help_slide_text_1"/>
                                </ewf-content-slider-item>
                            </ewf-content-slider>
                        </div>
                    </div>

                    <div class="row m-top-small">
                        <div class="col-3 fw-bold">
                            <fmt:message key="nfn_shr__email_tpl_select_label"/>
                        </div>
                        <div class="col-7">
                            <div class="select select_width_half">
                                <select id="custom_template_select"
                                   ng-options="option.key as option.nls | translate for option in notificationSharingCtrl.templateTypesList track by notificationSharingCtrl.mapOptionKey(option)"
                                   ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.customTemplate.selectedTemplateTypeKey"
                                   data-aqa-id="custom_template_select">
                                    <option hidden></option>
                                </select>
                            </div>
                            <a href="" class="info" id="custom_template_select_info"
                               data-aqa-id="custom_template_select_info">
                                <span>
                                    <fmt:message key="nfn_shr__email_tpl_select_info"/>
                                </span>
                            </a>
                        </div>
                    </div>

                    <div class="row margin-top-small">
                        <div class="col-3 fw-bold">
                            <fmt:message key="nfn_shr__email_tpl_subject_label"/>
                        </div>
                        <div class="col-7">
                            <input class="input input_width_half" type="text"
                               ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.customTemplate.emailSubject"
                               data-aqa-id="custom_template_subject">
                        </div>
                    </div>

                    <div class="row margin-top-small">
                        <div class="fw-bold">
                            <fmt:message key="nfn_shr__email_tpl_editor_label"/>
                        </div>
                    </div>

                    <div class="row dhl-notification-sharing__editor">
                        <div class="dhl-notification-sharing__editor-content col-9">
                            <textarea id="dhlTxtEditor"
                               ng-model="ckEditorBuffer"
                               ckeditor>
                            </textarea>
                        </div>
                        <div class="dhl-notification-sharing__editor-aside col-3">
                            <div class="heading">
                                <fmt:message key="nfn_shr__email_tpl_editor_tags_title"/>
                            </div>
                            <ul>
                                <li ng-repeat="templateTag in notificationSharingCtrl.templateTagsList"
                                   ng-click="ckEditorInsertTag(templateTag)"
                                   ng-bind="templateTag.name">
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div class="row margin-top-small">
                        <button class="btn btn_small btn_action"
                           ng-click="notificationSharingCtrl.sendTestEmail()"
                           data-aqa-id="custom_template_send_test">
                            <fmt:message key="nfn_shr__email_tpl_send_test_button"/>
                        </button>
                    </div>

                    <div class="margin-top-small">
                        <label class="checkbox">
                            <input id="custom_template_activate" class="checkbox__input" type="checkbox"
                               ng-model="notificationSharingCtrl.sharingList.shipmentSharingDefaults.customTemplate.turnedOnTemplate"
                               data-aqa-id="custom_template_turn_on">
                            <span class="label fw-bold">
                                <fmt:message key="nfn_shr__email_tpl_turn_on_label"/>
                            </span>
                        </label>
                    </div>

                    <div class="row margin-top">
                        <button class="btn btn_regular btn_primary-action"
                           ng-click="notificationSharingCtrl.saveTemplate()"
                           ng-disabled="notificationSharingCtrl.disableTemplateSaving()"
                           data-aqa-id="custom_template_save">
                            <fmt:message key="nfn_shr__email_tpl_save_btn"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div class="row m-top right">
        <a class="m-right-small" ng-click="notificationSharingCtrl.cancelChangesAction()"><fmt:message key="cancel_button"/></a>
        <a id="notification_sharing_save_btn" class="btn" href="#top-origin"
           ewf-click="notificationSharingCtrl.updateSharingList(sharingListForm, ewfFormCtrl)">
            <fmt:message key="nfn_shr__save_btn"/>
        </a>
    </div>
    </form>
</notification-sharing>
