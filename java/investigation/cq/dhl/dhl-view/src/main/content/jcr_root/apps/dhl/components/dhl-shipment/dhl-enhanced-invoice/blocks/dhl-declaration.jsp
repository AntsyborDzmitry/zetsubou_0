<%@page session="false" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@include file="/libs/foundation/global.jsp"%>
<cq:setContentBundle />

<ewf:registerComponent
        elements="
        ewf-file-uploader,
        ewf-progress-bar"
        paths="
        directives/ewf-file-uploader/ewf-file-uploader-directive,
        directives/ewf-progress-bar/ewf-progress-bar-directive" />

<section class="area">
    <h2 class="h2"><fmt:message key="shipment_type_enhanced_customs_declaration_title"/></h2>

    <div class="row">
        <div class="col-9">
            <div class="field-wrapper"
               ewf-field="invoiceUserName">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_declaration_name_label"/></label>
                <input type="text" class="input input_width_full" name="invoiceUserName"
                   ng-model="enhancedInvoiceCtrl.invoice.invoiceUserName"
                   ewf-input="enhancedInvoiceForm.invoiceUserName"
                   ewf-validate-required>
                <span class="validation-mark"></span>
                <div class="msg-error_left" ewf-field-errors></div>
            </div>
            <div class="field-wrapper"
               ewf-field="invoiceJobTitle">
                <label class="label"><fmt:message key="shipment_type_enhanced_customs_declaration_job_position_label"/></label>
                <input type="text" class="input input_width_full" name="invoiceJobTitle"
                   ng-model="enhancedInvoiceCtrl.invoice.invoiceJobTitle"
                   ewf-input="enhancedInvoiceForm.invoiceJobTitle"
                   ewf-validate-required>
                <span class="validation-mark"></span>
                <div class="msg-error_left" ewf-field-errors></div>
            </div>
            <br>

            <p><fmt:message key="shipment_type_enhanced_customs_declaration_logo_attach_description"/></p>

            <form method="POST" enctype="multipart/form-data" name="invoicesSignature" action="/api/shipment/customsInvoice/upload/company_logo">
                <ewf-file-uploader class="file-uploader"
                   files-uploaded="enhancedInvoiceCtrl.logoUploaded({key: key, src: src, size: size, name: name})"
                   files-upload-error="enhancedInvoiceCtrl.logoUploadError(errors)">
                    <ul class="file-list"
                       ng-if="fileUploaderCtrl.canShowFileList()">
                        <li class="file-list__item"
                           ng-repeat="fileInfo in fileUploaderCtrl.getFilesList() track by $index"
                           ng-bind="fileInfo.name">
                        </li>
                    </ul>
                    <div ng-show="enhancedInvoiceCtrl.isAttachLogoButtonVisible(fileUploaderCtrl)">
                        <div class="btn btn_upload">
                            <input type="file" name="image" accept="image/jpeg,image/png,image/tiff">
                            <label>
                                <i class="dhlicon-add"></i>
                                <span><fmt:message key="digital_customs_invoices_attach_logo"/></span>
                            </label>
                        </div>
                    </div>

                    <ewf-progress-bar
                       ng-if="fileUploaderCtrl.uploadStarted"
                       ewf-progress="fileUploaderCtrl.uploadProgress">
                    </ewf-progress-bar>

                    <div ng-if="enhancedInvoiceCtrl.logoUploadErrors.length">
                        <div class="alert alert_error"
                           ng-repeat="errorMessage in enhancedInvoiceCtrl.logoUploadErrors">
                            <span nls="{{errorMessage}}" nls-bind></span>
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

                    <div ng-if="enhancedInvoiceCtrl.invoice.logoParameters">
                        <ul class="file-list file-list_downloaded">
                            <li class="file-list__item">
                                <div class="row">
                                    <div class="col-5">
                                        <div class="file-list__file-name">{{enhancedInvoiceCtrl.invoice.logoParameters.name}}</div>
                                        {{enhancedInvoiceCtrl.invoice.logoParameters.size}}
                                    </div>
                                    <div class="col-5">
                                        <img class="full-width"
                                           ng-src="/api/{{enhancedInvoiceCtrl.invoice.logoParameters.src}}">
                                    </div>
                                    <div class="col-2 a-right">
                                        <a class="dhlicon-cancel btn-icon btn-icon_delete right"
                                           ng-click="enhancedInvoiceCtrl.removeLogoImage()">
                                            <fmt:message key="digital_customs_invoices_btn_delete"/>
                                        </a>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <button class="btn"
                           ng-if="enhancedInvoiceCtrl.isAttachNewLogoButtonVisible(fileUploaderCtrl)"
                           ng-click="enhancedInvoiceCtrl.removeLogoImage()">
                            <fmt:message key="digital_customs_invoices_attach_new_logo"/>
                        </button>
                    </div>
                </ewf-file-uploader>
            </form>
        </div>
    </div>
</section>
