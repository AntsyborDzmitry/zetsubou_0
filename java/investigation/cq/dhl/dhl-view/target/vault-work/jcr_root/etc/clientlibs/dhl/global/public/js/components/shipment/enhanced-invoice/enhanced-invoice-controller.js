define(['exports', 'module', './enhanced-invoice-service', './../../../services/modal/modal-service', './enhanced-invoice-model', './../ewf-shipment-service', './../../../services/location-service', './../../../constants/system-settings-constants'], function (exports, module, _enhancedInvoiceService, _servicesModalModalService, _enhancedInvoiceModel, _ewfShipmentService, _servicesLocationService, _constantsSystemSettingsConstants) {
    'use strict';

    module.exports = EnhancedInvoiceController;

    EnhancedInvoiceController.$inject = ['$timeout', 'systemSettings', 'shipmentService', 'modalService', 'locationService', 'enhancedInvoiceModel'];

    function EnhancedInvoiceController($timeout, systemSettings, shipmentService, modalService, locationService, enhancedInvoiceModel) {
        var vm = this;

        Object.assign(vm, {
            init: init,
            showSavedCustomsTemplatesPopup: showSavedCustomsTemplatesPopup,
            logoUploaded: logoUploaded,
            removeLogoImage: removeLogoImage,
            logoUploadError: logoUploadError,
            isAttachLogoButtonVisible: isAttachLogoButtonVisible,
            isAttachNewLogoButtonVisible: isAttachNewLogoButtonVisible,
            clearInvoice: clearInvoice,

            logoUploadErrors: []
        });

        function init() {
            vm.invoice = enhancedInvoiceModel.init({
                involvedPartiesData: shipmentService.getInvolvedPartiesAddressDetails()
            });

            locationService.loadAvailableLocations().then(function (countriesList) {
                enhancedInvoiceModel.setInvoiceData({ countriesList: countriesList });
                enhancedInvoiceModel.cacheModel();
            });
        }

        function showSavedCustomsTemplatesPopup() {
            modalService.showDialog({
                closeOnEsc: true,
                windowClass: 'ngdialog-theme-default ewf-modal_width_large',
                template: '<div ewf-modal nls-title=shipment.shipment_type_enhanced_customs_invoice_saved_template_popup_title id=customsInvoiceTemplates><div class=\"dashboard__cards a-center\"><a class=\"dashboard__arrow dashboard__arrow_left\"><i class=dhlicon-carat-left></i></a><div class=dashboard__card><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Saved Invoice Template Name 1</b></li><li>Commercial (no, there is no need to translate it)</li><li>Permanent (yes, it\'s draft layout)</li><li>DAP</li></ul><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Commodities</b></li><li>Hand-knit wool sweaters</li></ul><a class=\"btn btn_success btn_regular full-width\">Select Invoice</a></div><div class=dashboard__card><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Saved Invoice Template Name 2</b></li><li>Commercial</li><li>Permanent</li><li>DAP</li></ul><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Commodities</b></li><li>Widget 1</li></ul><a class=\"btn btn_success btn_regular full-width\">Select Invoice</a></div><div class=dashboard__card><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Saved Invoice Template Name 3</b></li><li>Commercial</li><li>Permanent</li><li>DAP</li></ul><ul class=\"no-bullets list_slim margin-bottom\"><li><b>Commodities</b></li><li>Wool cap</li></ul><a class=\"btn btn_success btn_regular full-width\">Select Invoice</a></div><a class=\"dashboard__arrow dashboard__arrow_right\"><i class=dhlicon-carat-right></i></a></div><p class=\"a-right margin-bottom-none\"><a nls=shipment.shipment_type_enhanced_customs_invoice_saved_template_popup_all_title></a></p></div>'
            });
        }

        function logoUploaded(logo) {
            vm.logoUploadErrors = [];
            vm.invoice.logoParameters = logo;
        }

        function removeLogoImage() {
            vm.invoice.logoParameters = null;
        }

        function logoUploadError(errors) {
            vm.logoUploadErrors = errors || [];

            if (!vm.logoUploadErrors.length) {
                vm.logoUploadErrors = ['errors.uploaded_file_failed'];
            }

            $timeout(function () {
                vm.logoUploadErrors = [];
            }, systemSettings.showInformationHintTimeout);
        }

        function isAttachLogoButtonVisible(fileUploaderCtrl) {
            return !fileUploaderCtrl.canShowFileList() && !vm.invoice.logoParameters;
        }

        function isAttachNewLogoButtonVisible(fileUploaderCtrl) {
            return fileUploaderCtrl.filesUploaded || !!vm.invoice.logoParameters;
        }

        function clearInvoice() {
            vm.invoice.resetModel();
            vm.invoice.logoParameters = null;
            vm.logoUploadErrors = [];
        }
    }
});
//# sourceMappingURL=enhanced-invoice-controller.js.map
