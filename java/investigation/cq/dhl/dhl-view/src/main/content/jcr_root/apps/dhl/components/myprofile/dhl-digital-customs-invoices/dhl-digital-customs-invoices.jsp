<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8" %>
<%@include file="/apps/dhl/foundation/global.jsp"%>
<cq:setContentBundle/>

<ewf:registerComponent 
        elements="ewf-content-slider,
            ewf-modal,
            ewf-paperless-customs,
            ewf-paperless-customs-terms-conditions,
            ewf-file-uploader,
            ewf-progress-bar"
        paths="directives/ewf-content-slider/ewf-content-slider-directive,
            directives/ewf-modal/ewf-modal-directive,
            directives/ewf-file-uploader/ewf-file-uploader-directive,
            directives/ewf-progress-bar/ewf-progress-bar-directive,
            components/profile-shipment-defaults/paperless-customs/paperless-customs-directive,
            components/profile-shipment-defaults/paperless-customs/paperless-customs-terms-conditions-directive,
            directives/ewf-validate/ewf-validate-required-directive,
            directives/ewf-input/ewf-input-directive" />

<ewf-paperless-customs
   ewf-form="paperlessCustoms">
    <div class="row">
        <div class="col-4">
            <h3 class="margin-none">
                <fmt:message key="digital_customs_invoices_title"/>
            </h3>
        </div>
        <div class="col-8">
            <ewf-content-slider show-when="paperlessCustomsCtrl.isPaperlessHelpShown">
                <ewf-content-slider-item header="<fmt:message key='digital_customs_invoices_help_title'/>">
                    <div class="section-help__tab__content__notifications">
                        <fmt:message key='digital_customs_invoices_help_message'/>
                        <small>
                            <ul class="margin-none">
                                <li class="margin-none">
                                    <fmt:message key='digital_customs_invoices_help_item1'/>
                                </li>
                                <li class="margin-none">
                                    <fmt:message key='digital_customs_invoices_help_item2'/>
                                </li>
                                <li class="margin-none">
                                    <fmt:message key='digital_customs_invoices_help_item3'/>
                                </li>
                                <li class="margin-none">
                                    <fmt:message key='digital_customs_invoices_help_item4'/>
                                </li>
                            </ul>
                        </small>
                    </div>
                </ewf-content-slider-item>
            </ewf-content-slider>
            <div class="right">
                <a class="section-help__link"
                   ng-click="paperlessCustomsCtrl.togglePaperlessHelp()">
                    <fmt:message key="digital_customs_invoices_help_with_this"/>
                </a>
            </div>
        </div>
    </div>
    <div class="row">
        <hr class="hr margin-top-none">
        <p class="margin-top-none">
            <fmt:message key="digital_customs_invoices_header_message"/>
        </p>
    </div>
    <div class="row">
        <div class="col-8">
            <div class="alert alert_success"
               ng-if="paperlessCustomsCtrl.actionStatus.enrolled">
                <h4 class="h4 margin-none">
                    <fmt:message key="digital_customs_invoices_success_title"/>
                </h4>
                <fmt:message key="digital_customs_invoices_success_message"/>
            </div>
            <div class="row"
               ng-if="!paperlessCustomsCtrl.settings.enrolled">
                <div class="switcher">
                    <input type="radio" id="paperless-enroll" required="required" value="enroll" name="enroll" class="switcher__input"
                       ng-class="{checked: paperlessCustomsCtrl.enrollmentRequest}"
                       ng-model="paperlessCustomsCtrl.enrollmentRequest">
                    <label class="switcher__label" for="paperless-enroll">
                        <fmt:message key="digital_customs_invoices_enroll"/>
                    </label>
                </div>
            </div>

            <div ng-if="paperlessCustomsCtrl.isEnrollmentDisplayed()">
                <div ng-if="paperlessCustomsCtrl.settings.enrolled">
                    <p><fmt:message key="digital_customs_invoices_currently_enrolled"/></p>
                    <p><fmt:message key="digital_customs_invoices_may_pause"/></p>

                    <div class="overlay-white">
                        <div class="row"
                           ng-show="paperlessCustomsCtrl.settings.enabled">
                            <div class="col-6">
                                <i class="check-icon"></i>
                                <span class="text_gray"><fmt:message key="digital_customs_invoices_current_status"/></span>
                                <span class="fw-bold"><fmt:message key="digital_customs_invoices_enabled"/></span>
                            </div>
                            <div class="col-6 a-right">
                                <a class="btn btn_action" id="pause-digital-customs-invoices"
                                   ng-click="paperlessCustomsCtrl.pausePaperless()">
                                    <fmt:message key="digital_customs_invoices_action_pause"/>
                                </a>
                            </div>
                        </div>
                        <div class="row"
                           ng-hide="paperlessCustomsCtrl.settings.enabled">
                            <div class="col-6">
                                <i class="dhlicon-alert"></i>
                                <span class="text_gray"><fmt:message key="digital_customs_invoices_current_status"/></span>
                                <span class="fw-bold"><fmt:message key="digital_customs_invoices_paused"/></span>
                            </div>
                            <div class="col-6 a-right">
                                <a class="btn btn_action" id="restart-digital-customs-invoices"
                                   ng-click="paperlessCustomsCtrl.enablePaperless()">
                                    <fmt:message key="digital_customs_invoices_action_restart"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row switcher switcher_width_full margin-bottom">
                    <p><b><fmt:message key="digital_customs_invoices_would_generate"/></b></p>

                    <div class="col-5">
                        <input type="radio" id="digital-customs-invoices-dhl" required="required" name="customsDocType" class="switcher__input"
                           value="{{paperlessCustomsCtrl.generated.DHL}}"
                           ng-class="{checked: paperlessCustomsCtrl.settings.generatedBy === paperlessCustomsCtrl.generated.DHL}"
                           ng-model="paperlessCustomsCtrl.settings.generatedBy">
                        <label class="switcher__label" for="digital-customs-invoices-dhl">
                            <fmt:message key="digital_customs_invoices_yes"/>
                        </label>

                        <div class="switcher__details">
                            <fmt:message key="digital_customs_invoices_dhl_generated"/>
                        </div>
                    </div>
                    <div class="col-5">
                        <input type="radio" id="digital-customs-invoices-own" required="required" name="customsDocType" class="switcher__input"
                           value="{{paperlessCustomsCtrl.generated.OWN}}"
                           ng-class="{checked: paperlessCustomsCtrl.settings.generatedBy === paperlessCustomsCtrl.generated.OWN}"
                           ng-model="paperlessCustomsCtrl.settings.generatedBy">
                        <label class="switcher__label" for="digital-customs-invoices-own">
                            <fmt:message key="digital_customs_invoices_no"/>
                        </label>

                        <div class="switcher__details">
                            <fmt:message key="digital_customs_invoices_my_own"/>
                        </div>
                    </div>
                </div>
                <div ng-if="paperlessCustomsCtrl.settings.generatedBy === paperlessCustomsCtrl.generated.DHL">
                    <div class="row">
                        <p><b><fmt:message key="digital_customs_invoices_attach_signature_logo"/></b></p>
                        <div class="margin-bottom">
                            <b><fmt:message key="digital_customs_invoices_electronic_signature"/></b>
                            <div><fmt:message key="digital_customs_invoices_electronic_signature_description"/></div>
                            <div><fmt:message key="digital_customs_invoices_upload_file_types"/></div>
                        </div>
                        <div class="msg-error"
                           ng-show="paperlessCustomsCtrl.isSignatureRequiredError()">
                            <fmt:message key="digital_customs_invoices_signature_required"/>
                        </div>
                        <div class="row">
                            <div class="col-12 field-wrapper">
                                <form method="POST" enctype="multipart/form-data" name="invoicesSignature" action="/api/myprofile/customs/paperless/image/signature">
                                    <ewf-file-uploader class="file-uploader"
                                       files-uploaded="paperlessCustomsCtrl.signatureUploaded({key: key, src: src, size: size, name: name})"
                                       files-upload-error="paperlessCustomsCtrl.fileUploadError({errors: errors, type: 'signature'})">
                                        <ul class="file-list"
                                           ng-if="fileUploaderCtrl.canShowFileList()">
                                            <li class="file-list__item"
                                               ng-repeat="fileInfo in fileUploaderCtrl.getFilesList() track by $index"
                                               ng-bind="fileInfo.name"></li>
                                        </ul>
                                        <div>
                                            <div class="btn btn_upload"
                                               ng-show="!fileUploaderCtrl.canShowFileList() && !paperlessCustomsCtrl.settings.signature">
                                                <input type="file" name="image" accept="image/jpeg,image/png,image/tiff">
                                                <label>
                                                    <i class="dhlicon-add"></i>
                                                    <span><fmt:message key="digital_customs_invoices_attach_signature"/></span>
                                                </label>
                                            </div>
                                            <span class="note"></span>
                                        </div>

                                        <div ng-if="paperlessCustomsCtrl.settings.signature">
                                            <ul class="file-list file-list_downloaded">
                                                <li class="file-list__item">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div>
                                                                <a target="_blank"
                                                                   ng-href="{{paperlessCustomsCtrl.settings.signature.src}}"
                                                                   ng-bind="paperlessCustomsCtrl.settings.signature.name"></a>
                                                            </div>
                                                            <div ng-bind="paperlessCustomsCtrl.settings.signature.size"></div>
                                                        </div>
                                                        <div class="col-5">
                                                            <img class="full-width"
                                                               ng-src="/api/{{paperlessCustomsCtrl.settings.signature.src}}">
                                                        </div>
                                                        <div class="col-2 a-right">
                                                            <a class="dhlicon-cancel btn-icon btn-icon_delete right"
                                                               ng-click="paperlessCustomsCtrl.removeImage('signature')">
                                                                <fmt:message key="digital_customs_invoices_btn_delete"/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <button class="btn btn_upload"
                                               ng-if="fileUploaderCtrl.filesUploaded || paperlessCustomsCtrl.settings.signature"
                                               ng-click="paperlessCustomsCtrl.removeImage('signature')">
                                                <fmt:message key="digital_customs_invoices_attach_new_signature"/>
                                            </button>
                                        </div>

                                        <ewf-progress-bar
                                           ng-if="fileUploaderCtrl.uploadStarted"
                                           ewf-progress="fileUploaderCtrl.uploadProgress">
                                        </ewf-progress-bar>
                                        <br/>

                                        <div ng-if="paperlessCustomsCtrl.errors.signature.length">
                                            <div class="alert alert_error"
                                               ng-repeat="errorMessage in paperlessCustomsCtrl.errors.signature">
                                                <span nls="{{errorMessage}}"></span>
                                            </div>
                                        </div>

                                        <div ng-if="fileUploaderCtrl.canShowFileList()">
                                            <button class="btn btn_action btn_regular" type="button"
                                               ng-click="fileUploaderCtrl.clearFilesList()">
                                                <fmt:message key="digital_customs_invoices_btn_cancel"/>
                                            </button>
                                            <button class="btn btn_success btn_regular" type="button"
                                               ng-click="fileUploaderCtrl.uploadFiles()">
                                                <fmt:message key="digital_customs_invoices_btn_upload"/>
                                            </button>
                                        </div>
                                    </ewf-file-uploader>
                                </form>
                            </div>
                        </div>

                        <div class="row"
                           ng-form="paperlessCustomsCtrl.signerForm">
                            <div class="col-6 field-wrapper"
                               ewf-field="signerName">
                                <label class="label" for="signer-name">
                                    <fmt:message key="digital_customs_invoices_signer_name"/>
                                </label>
                                <input type="text" id="signer-name" class="input" required="required" name="name"
                                   ng-model="paperlessCustomsCtrl.settings.signerName"
                                   ewf-input="paperlessCustoms.signerName"
                                   ewf-validate-required>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </div>
                            <div class="col-6 field-wrapper"
                               ewf-field="signerTitle">
                                <label class="label" for="signer-title">
                                    <fmt:message key="digital_customs_invoices_signer_title"/>
                                </label>
                                <input type="text" id="signer-title" class="input" required="required" name="title"
                                   ng-model="paperlessCustomsCtrl.settings.signerTitle"
                                   ewf-input="paperlessCustoms.signerTitle"
                                   ewf-validate-required>
                                <span class="validation-mark"></span>
                                <div ewf-field-errors></div>
                            </div>
                        </div>

                        <p>
                            <b><fmt:message key="digital_customs_invoices_company_logo"/></b>
                            <div><fmt:message key="digital_customs_invoices_company_logo_description"/></div>
                            <div><fmt:message key="digital_customs_invoices_upload_file_types"/></div>
                        </p>

                        <div class="row">
                            <div class="col-12 field-wrapper">
                                <form method="POST" enctype="multipart/form-data" name="invoicesSignature" action="/api/myprofile/customs/paperless/image/company_logo">
                                    <ewf-file-uploader class="file-uploader"
                                       files-uploaded="paperlessCustomsCtrl.logoUploaded({key: key, src: src, size: size, name: name})"
                                       files-upload-error="paperlessCustomsCtrl.fileUploadError({errors: errors, type: 'logo'})">
                                        <ul class="file-list"
                                           ng-if="fileUploaderCtrl.canShowFileList()">
                                            <li class="file-list__item"
                                               ng-repeat="fileInfo in fileUploaderCtrl.getFilesList() track by $index"
                                               ng-bind="fileInfo.name"></li>
                                        </ul>
                                        <div>
                                            <div class="btn btn_upload"
                                               ng-show="!fileUploaderCtrl.canShowFileList() && !paperlessCustomsCtrl.settings.logo">
                                                <input type="file" name="image" accept="image/jpeg,image/png,image/tiff">
                                                <label>
                                                    <i class="dhlicon-add"></i>
                                                    <span><fmt:message key="digital_customs_invoices_attach_logo"/></span>
                                                </label>
                                            </div>
                                            <span class="note"></span>
                                        </div>

                                        <ewf-progress-bar
                                           ng-if="fileUploaderCtrl.uploadStarted"
                                           ewf-progress="fileUploaderCtrl.uploadProgress">
                                        </ewf-progress-bar>
                                        <br/>

                                        <div ng-if="paperlessCustomsCtrl.errors.logo.length">
                                            <div class="alert alert_error"
                                               ng-repeat="errorMessage in paperlessCustomsCtrl.errors.logo">
                                                <span nls="{{errorMessage}}"></span>
                                            </div>
                                        </div>

                                        <div ng-if="fileUploaderCtrl.canShowFileList()">
                                            <button class="btn btn_action btn_regular" type="button"
                                               ng-click="fileUploaderCtrl.clearFilesList()">
                                                <fmt:message key="digital_customs_invoices_btn_cancel"/>
                                            </button>
                                            <button class="btn btn_success btn_regular" type="button"
                                               ng-click="fileUploaderCtrl.uploadFiles()">
                                                <fmt:message key="digital_customs_invoices_btn_upload"/>
                                            </button>
                                        </div>

                                        <div ng-if="paperlessCustomsCtrl.settings.logo">
                                            <ul class="file-list file-list_downloaded">
                                                <li class="file-list__item">
                                                    <div class="row">
                                                        <div class="col-5">
                                                            <div>
                                                                <a target="_blank"
                                                                   ng-href="{{paperlessCustomsCtrl.settings.logo.src}}"
                                                                   ng-bind="paperlessCustomsCtrl.settings.logo.name"></a>
                                                            </div>
                                                            <div ng-bind="paperlessCustomsCtrl.settings.logo.size"></div>
                                                        </div>
                                                        <div class="col-5">
                                                            <img class="full-width"
                                                               ng-src="/api/{{paperlessCustomsCtrl.settings.logo.src}}">
                                                        </div>
                                                        <div class="col-2 a-right">
                                                            <a class="dhlicon-cancel btn-icon btn-icon_delete right"
                                                               ng-click="paperlessCustomsCtrl.removeImage('logo')">
                                                                <fmt:message key="digital_customs_invoices_btn_delete"/>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                            <button class="btn"
                                               ng-if="fileUploaderCtrl.filesUploaded || paperlessCustomsCtrl.settings.logo"
                                               ng-click="paperlessCustomsCtrl.removeImage('logo')">
                                                <fmt:message key="digital_customs_invoices_attach_new_logo"/>
                                            </button>
                                        </div>
                                    </ewf-file-uploader>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="margin-top"
                       ng-show="paperlessCustomsCtrl.isTermsAgreementDisplayed()">
                        <b><fmt:message key="digital_customs_invoices_must_accept_terms_conditions"/></b>
                        <div class="overlay__scroll textarea margin-top margin-bottom"
                           ewf-paperless-customs-terms-conditions>
                        </div>
                    </div>
                    <a class="view-terms-conditions"
                       ng-show="paperlessCustomsCtrl.settings.enrolled"
                       ng-click="paperlessCustomsCtrl.termsConditionsPopup()">
                        <fmt:message key="digital_customs_invoices_view_terms_conditions"/>
                    </a>
                    <div class="right">
                        <button class="btn btn_success" type="submit"
                           ng-show="paperlessCustomsCtrl.isTermsAgreementDisplayed()"
                           ng-click="paperlessCustomsCtrl.acceptTermsConditions(ewfFormCtrl)">
                            <fmt:message key="digital_customs_invoices_btn_agree_continue"/>
                        </button>
                        <button class="btn" type="submit"
                           ng-show="paperlessCustomsCtrl.settings.enrolled"
                           ng-click="paperlessCustomsCtrl.updateSettings(ewfFormCtrl)">
                            <fmt:message key="digital_customs_invoices_btn_save_update"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <cq:include path="customs-clearance-video" resourceType="dhl/components/myprofile/dhl-customs-clearance-video"/>
        </div>
    </div>
</ewf-paperless-customs>