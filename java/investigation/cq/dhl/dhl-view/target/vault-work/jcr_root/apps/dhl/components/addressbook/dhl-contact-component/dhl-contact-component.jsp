<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle source="page"/>

<c:if test="${isUserProfileBookPage != null}">
    <div ng-switch-when="${properties['tabName']}">
</c:if>
<ewf:registerComponent
   elements="ewf-contact-info,
       ewf-address,
       contact-payment-info,
       contact-pickup-info,
       contact-notifications-info"
   paths="components/address-book/contact-info/contact-info-directive,
       directives/ewf-input/ewf-input-controller,
       directives/ewf-validate/ewf-validate-pattern-directive,
       directives/ewf-validate/ewf-validate-required-directive,
       directives/ewf-validate/ewf-validate-email-directive,
       directives/ewf-spinner/ewf-spinner-directive"/>

<div class="spinner-wrapper"
   ewf-spinner
   data-aq-id="spinner"
   ng-show="ewfSpinnerCtrl.isSpinnerVisible()">
    <div class="spinner-wrapper__spinner"></div>
</div>

<ewf-contact-info is-profile="${isUserProfileBookPage}">
    <form name="contactDetails" class="contact-details-form" novalidate=""
       ewf-form="contactDetails">
        <div class="container">
            <c:if test="${not isUserProfileBookPage}">
                <div class="menu-bar">
                    <ul class="menu-bar__items">
                        <li class="menu-bar__item">
                            <a id="cancelSaveContact" class="btn btn_action btn_action_white margin-none"
                               ng-click="contactInfoCtrl.confirmOfUnsavedData()">
                                <i class="dhlicon-cancel"></i>
                                <fmt:message key="cancel_contact_edit_button"/>
                            </a>
                        </li>
                        <li class="menu-bar__item">
                            <button id="saveAndAddContact" class="btn btn_success btn_small margin-none"
                               ng-disabled="contactInfoCtrl.disableSubmitButton"
                               ng-click="contactInfoCtrl.submitContactInfo(ewfFormCtrl, contactDetails)">
                                <i class="dhlicon-save"></i>
                                <fmt:message key="save_and_add_contact_button"/>
                            </button>
                        </li>
                    </ul>
                </div>
                <h1 class="page-title"
                   ng-bind="contactInfoCtrl.contactInfoTitle">
                </h1>
            </c:if>
  
  
            <div class="${properties.separateArea ? "area" : ""}">
                <c:if test="${not isUserProfileBookPage}">
                    <h3 class="margin-top-none"><fmt:message key="contact_details_label"/></h3>
                </c:if>
                <c:if test="${isUserProfileBookPage}">
                    <div class="row">
                        <fmt:message key="login_info_tab_description"/><br><br>
                    </div>
                    <div class="row">
                        <h5 class="margin-top-none"><fmt:message key="contact_information_label"/></h5>
                    </div>
                </c:if>
                <div class="alert alert_success"
                   ng-if="contactInfoCtrl.profileUpdated">
                    <fmt:message key="profile_updated_message"/>
                </div>
                <div ewf-form-errors></div>
                <div class="row">
                    <div class="${isUserProfileBookPage ? "col-6" : "col-5"}">
                        <cq:include path="address" resourceType="dhl/components/addressbook/dhl-address"/>
                    </div>
  
                    <div class="col-6">
  
                        <c:if test="${not isUserProfileBookPage}">
                            <div class="field-wrapper"
                               ewf-field="email">
                                <label for="email" class="label"><fmt:message key="email_address_label"/></label>
                                <input id="email" type="email" name="email" class="input input_width_full" maxlength="50"
                                   ewf-input="contactDetails.email"
                                   ng-model="contactInfoCtrl.contact.contactDetails.email"
                                   ewf-validate-required
                                   ewf-validate-email>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </div>
  
                            <div ng-form="contactEmailsForm" ng-if="contactDetails.email.$valid" class="m-bottom">
                                <div class="row"
                                   ng-repeat="email in contactInfoCtrl.emails">
  
                                    <div class="col-9">
                                        <div class="field-wrapper"
                                           ewf-field="{{'email_' + $index}}">
                                            <label class="label"
                                               ng-if="$index === 0">
                                                <fmt:message key="email_address_additional_label"/>
                                            </label>
                                            <input type="input" id="{{'contactEmail_' + $index}}" class="input input_width_full" maxlength="50"
                                               placeholder="<fmt:message key="additional_email_placeholder_label"/>"
                                               ewf-input="{{'contactDetails.email_' + $index}}"
                                               ng-model="email.value"
                                               ng-change="contactInfoCtrl.convertEmailsArrayToEmailFields()"
                                               ewf-validate-email>
                                            <div ewf-field-errors></div>
                                            <a class="btn btn_action"
                                               ng-click="contactInfoCtrl.removeUserEmail(email)"
                                               ng-show="contactInfoCtrl.emails.length">
                                                <i class="dhlicon-remove"></i>
                                                <fmt:message key="remove_email_button_title"/>
                                            </a>
                                        </div>
                                    </div>
  
                                </div>
  
                                <div class="row"
                                   ng-if="contactInfoCtrl.showBottomAddEmailButton()">
                                    <button class="btn btn_small"
                                       ng-click="contactInfoCtrl.addUserEmail()"
                                       ng-disabled="!contactInfoCtrl.isAdditionalEmailsCorrect(contactEmailsForm)">
                                        <i class="dhlicon-add"></i><span class="btn__text"><fmt:message key="add_new_email_button_title"/></span>
                                    </button>
                                </div>
  
                            </div>
                        </c:if>
  
                        <cq:include path="phone" resourceType="dhl/components/addressbook/dhl-phone-component"/>
  
                        <div class="field-wrapper"
                           ewf-field="vatTaxId"
                           ng-if="!contactInfoCtrl.countrySpecificBehaviorBr()">
                            <div class="col-6">
                                <label for="vat" class="label"><fmt:message key="vat_tax_id_label"/></label>
                                <input type="text" class="input input_width_full" maxlength="20" id="vat" name="vat"
                                   ewf-input="contactDetails.vatTaxId"
                                   ewf-validate-pattern="TAX_ID"
                                   ng-model="contactInfoCtrl.contact.contactDetails.taxDetails.vatTaxId">
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </div>
                        </div>
                        <div class="field-wrapper"
                           ewf-field="eoriNumber">
                            <div class="col-6">
                                <label for="vat" class="label"><fmt:message key="eori_number_label"/></label>
                                <input type="text" class="input input_width_full" maxlength="30" id="eoriNumber" name="vat"
                                   ng-model="contactInfoCtrl.contact.contactDetails.taxDetails.eoriNumber">
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </div>
                        </div>
                        <div class="field-wrapper"
                           ng-if="contactInfoCtrl.countrySpecificBehaviorBr()">
                            <span class="col-6" ewf-field="cnpjOrCPFTaxID">
                                <label for="vat" class="label"><fmt:message key="cnpj_number_label"/></label>
                                <input id="cnpjOrCPFTaxID" class="input input_width_full" name="cnpjOrCPFTaxID" type="text" maxlength="{{contactInfoCtrl.cpfCnpjLength}}"
                                   ng-model="contactInfoCtrl.contact.contactDetails.taxDetails.cnpjOrCPFTaxID"
                                   ng-disabled="!contactInfoCtrl.contact.contactDetails.taxDetails.cnpjOrCPFTaxType"
                                   ewf-input="contactDetails.cnpjOrCPFTaxID"
                                   ewf-validate-pattern="CNPJ_OR_CPF_TAX_ID"
                                   ewf-validate-required>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </span>
                            <span class="col-6 radio inline-radio-group"
                               ewf-field="cnpjOrCPFTaxType">
                                <input id="radio_cnpj" class="radio__input radio" name="radio_cnpj_cpf" type="radio" value="CNPJ"
                                   ng-model="contactInfoCtrl.contact.contactDetails.taxDetails.cnpjOrCPFTaxType"
                                   ng-click="contactInfoCtrl.checkCpfCnpjLength('CNPJ')"
                                   ewf-input="contactDetails.cnpjOrCPFTaxType"
                                   ewf-validate-required>
                                <label for="radio_cnpj" class="label"><fmt:message key="cnpj_code"/></label>
                                <input id="radio_cpf" class="radio__input radio" name="radio_cnpj_cpf" type="radio" value="CPF"
                                   ng-model="contactInfoCtrl.contact.contactDetails.taxDetails.cnpjOrCPFTaxType"
                                   ng-click="contactInfoCtrl.checkCpfCnpjLength('CPF')"
                                   ewf-input="contactDetails.cnpjOrCPFTaxType"
                                   ewf-validate-required>
                                <label for="radio_cpf" class="label"><fmt:message key="cpf_code"/></label>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </span>
                        </div>
                        <c:if test="${not isUserProfileBookPage}">
                            <div class="field-wrapper"
                               ewf-field="matchCode">
                                <div class="col-6">
                                    <label for="vat" class="label"><fmt:message key="match_code_label"/></label>
                                    <input type="text" class="input input_width_full" maxlength="20" id="matchCode" name="vat"
                                       ng-model="contactInfoCtrl.contact.contactDetails.matchCode">
                                    <span class="validation-mark"></span>
                                    <div ewf-field-errors></div>
                                </div>
                            </div>
                            <label class="field-wrapper"
                               ng-if="contactInfoCtrl.contact.contactDetails.addressDetails.countryCode">
                                <span class="label"><fmt:message key="additional_notes_label"/></span>
                                <textarea class="textarea textarea_width_full"
                                   ng-model="contactInfoCtrl.contact.contactDetails.additionalNotes">
                                </textarea>
                            </label>
                            <div class="row">
                                <div class="col-6">
                                    <h4><fmt:message key="address_settings_label"/></h4>
                                    <label class="checkbox checkbox_inline margin-right">
                                        <input type="checkbox" id="checkbox_favoriteReceiver" value="true" name="favorite['receiver']" class="checkbox__input"
                                           data-aqa-id="checkbox_favoriteReceiver"
                                           ng-model="contactInfoCtrl.contact.contactDetails.favoriteShipTo">
                                        <span class="label checkbox__label">
                                            <fmt:message key="favorite_ship_to_label"/>
                                        </span>
                                    </label>
                                    <label class="checkbox checkbox_inline margin-right">
                                        <input type="checkbox" id="checkbox_favoriteShipper" value="true" name="favorite['shipper']" class="checkbox__input"
                                           data-aqa-id="checkbox_favoriteShipper"
                                           ng-model="contactInfoCtrl.contact.contactDetails.favoriteShipFrom">
                                        <span class="label checkbox__label">
                                            <fmt:message key="favorite_ship_from_label"/>
                                        </span>
                                    </label>
                                    <label class="checkbox checkbox_inline margin-right">
                                        <input type="checkbox" id="checkbox_favoriteAssign" value="true" name="favorite['assign']" class="checkbox__input"
                                           data-aqa-id="checkbox_favoriteAssign"
                                           ng-model="contactInfoCtrl.contact.contactDetails.favoriteAssignTo">
                                        <span class="label checkbox__label">
                                            <fmt:message key="favorite_assign_to_label"/>
                                        </span>
                                    </label>
                                </div>
                                <div class="col-6">
                                    <div class="callout margin-top">
                                        <span class="callout__content"><fmt:message key="saving_contact_message"/></span>
                                    </div>
                                </div>
                            </div>
                        </c:if>
                    </div>
                    <div class="col-1"></div>
                </div>
                <c:if test="${isUserProfileBookPage != null}">

                    <div class="row a-right">
                        <br>
                        <button class="btn" id="saveAndAddContactBottom"
                           ng-click="contactInfoCtrl.submitContactInfo(ewfFormCtrl, contactDetails)"
                           ng-hide="contactDetails.$pristine || contactInfoCtrl.disableSubmitButton">
                            <fmt:message key="update_contact_button"/>
                        </button>
                    </div>
                </c:if>
            </div>

            <c:if test="${not isUserProfileBookPage}">
                <section class="area">
                    <header class="area__header">
                        <h3 class="area__title"><fmt:message key="optional_settings_and_defaults_label"/></h3>
                        <p><fmt:message key="save_time_label"/></p>
                    </header>
                    <div class="row">
                        <div class="col-6">
                            <contact-payment-info payment-settings="contactInfoCtrl.contact.paymentSetting"></contact-payment-info>
                            <cq:include path="contact-pickup-info" resourceType="dhl/components/addressbook/dhl-pickup-component"/>
                            <cq:include path="notification-info" resourceType="dhl/components/addressbook/dhl-notifications-component"/>
                        </div>
                        <div class="col-6">
                            <cq:include path="contact-shipping-info" resourceType="dhl/components/addressbook/dhl-contact-shipping-info"/>
                            <div contact-share-info share-settings="contactInfoCtrl.contact.shareSetting"></div>
                            <div contact-mailing-lists mailing-lists="contactInfoCtrl.contact.mailingListSetting.selectedMailingLists"></div>
                        </div>
                    </div>
                </section>
            </c:if>
        </div>
    </form>
</ewf-contact-info>

<c:if test="${isUserProfileBookPage != null}">
</div>
</c:if>
